import type { UserRepository } from '@/repositories/user.repository';
import { AppError } from '@/utils/AppError';
import { toPublicUser, type PublicUser } from '@/utils/serializers';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getById(id: string): Promise<PublicUser> {
    const user = await this.userRepository.findById(id);
    if (!user) throw AppError.notFound('Usuário não encontrado');
    return toPublicUser(user);
  }
}
