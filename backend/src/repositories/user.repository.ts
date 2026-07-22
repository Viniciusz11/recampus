import type { PrismaClient, User } from '@prisma/client';

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
}

/**
 * Services dependem desta interface, não de PrismaUserRepository diretamente
 * (Inversão de Dependência) - permite testar AuthService/UserService com um
 * repositório fake em memória, sem banco.
 */
export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
}

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  create(data: CreateUserData): Promise<User> {
    return this.prisma.user.create({ data });
  }
}
