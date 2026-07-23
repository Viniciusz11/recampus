import type { UserRepository } from '@/repositories/user.repository';
import type { RefreshTokenRepository } from '@/repositories/refresh-token.repository';
import type { LoginInput, RegisterInput } from '@/schemas/auth.schemas';
import { AppError } from '@/utils/AppError';
import { comparePassword, hashPassword, hashToken } from '@/utils/hash';
import { getTokenExpiry, signAccessToken, signRefreshToken, verifyRefreshToken } from '@/utils/jwt';
import { toPublicUser, type PublicUser } from '@/utils/serializers';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult extends AuthTokens {
  user: PublicUser;
}

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async register(input: RegisterInput): Promise<AuthResult> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) throw AppError.conflict('E-mail já cadastrado');

    const passwordHash = await hashPassword(input.password);
    const user = await this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      phone: input.phone,
    });

    const tokens = await this.issueTokens(user.id, user.email);
    return { user: toPublicUser(user), ...tokens };
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(input.email);
    // Mensagem genérica de propósito: não revela se foi o e-mail ou a senha
    // que estava errada, evitando que alguém descubra quais e-mails têm
    // conta cadastrada (enumeração de contas).
    if (!user) throw AppError.unauthorized('E-mail ou senha inválidos');

    const passwordMatches = await comparePassword(input.password, user.passwordHash);
    if (!passwordMatches) throw AppError.unauthorized('E-mail ou senha inválidos');

    const tokens = await this.issueTokens(user.id, user.email);
    return { user: toPublicUser(user), ...tokens };
  }

  async refresh(rawRefreshToken: string): Promise<AuthTokens> {
    const payload = verifyRefreshToken(rawRefreshToken);
    const tokenHash = hashToken(rawRefreshToken);
    const stored = await this.refreshTokenRepository.findByHash(tokenHash);

    if (!stored || stored.revokedAt !== null || stored.expiresAt < new Date()) {
      throw AppError.unauthorized('Refresh token inválido ou expirado');
    }

    const user = await this.userRepository.findById(payload.sub);
    if (!user) throw AppError.unauthorized('Usuário não encontrado');

    // Rotação: o token apresentado é revogado antes de emitir o novo par.
    // Se o mesmo refresh token vazado for reutilizado depois, ele já estará
    // revogado e a tentativa cai no "if" acima.
    await this.refreshTokenRepository.revokeById(stored.id);

    return this.issueTokens(user.id, user.email);
  }

  async logout(rawRefreshToken: string): Promise<void> {
    const tokenHash = hashToken(rawRefreshToken);
    const stored = await this.refreshTokenRepository.findByHash(tokenHash);

    if (stored && stored.revokedAt === null) {
      await this.refreshTokenRepository.revokeById(stored.id);
    }
  }

  private async issueTokens(userId: string, email: string): Promise<AuthTokens> {
    const accessToken = signAccessToken({ sub: userId, email });
    const refreshToken = signRefreshToken({ sub: userId });

    await this.refreshTokenRepository.create({
      userId,
      tokenHash: hashToken(refreshToken),
      expiresAt: getTokenExpiry(refreshToken),
    });

    return { accessToken, refreshToken };
  }
}
