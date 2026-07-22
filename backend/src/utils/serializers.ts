import type { User } from '@prisma/client';

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt: Date;
}

/** Nunca serializar um User direto na resposta HTTP - isso vazaria passwordHash. */
export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  };
}
