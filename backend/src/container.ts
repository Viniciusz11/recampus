import { prisma } from '@/config/prisma';
import { supabaseStorage } from '@/config/supabaseStorage';
import { PrismaAdRepository } from '@/repositories/ad.repository';
import { PrismaRefreshTokenRepository } from '@/repositories/refresh-token.repository';
import { PrismaUserRepository } from '@/repositories/user.repository';
import { AdService } from '@/services/ad.service';
import { AuthService } from '@/services/auth.service';
import { UploadService } from '@/services/upload.service';
import { UserService } from '@/services/user.service';

/**
 * Raiz de composição: único lugar onde uma implementação concreta
 * (PrismaXRepository) é ligada a um service. Sem framework de DI - para 3
 * services isso seria complexidade desproporcional ao projeto - mas services
 * continuam dependendo das interfaces (UserRepository, AdRepository...),
 * então trocar Prisma por outra coisa só mudaria este arquivo.
 */
const userRepository = new PrismaUserRepository(prisma);
const adRepository = new PrismaAdRepository(prisma);
const refreshTokenRepository = new PrismaRefreshTokenRepository(prisma);

export const userService = new UserService(userRepository);
export const adService = new AdService(adRepository);
export const authService = new AuthService(userRepository, refreshTokenRepository);
export const uploadService = new UploadService(supabaseStorage);
