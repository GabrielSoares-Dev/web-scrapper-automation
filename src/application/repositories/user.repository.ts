import {
  CreateUserRepositoryInputDto,
  CreateUserRepositoryOutputDto,
} from '@application/dtos/repositories/user/create.dto';
import { FindUserByEmailRepositoryOutputDto } from '@application/dtos/repositories/user/findByEmail.dto';

export const USER_REPOSITORY_TOKEN = 'USER_REPOSITORY_TOKEN';

export interface UserRepositoryInterface {
  create(
    input: CreateUserRepositoryInputDto,
  ): Promise<CreateUserRepositoryOutputDto>;
  findByEmail(
    email: string,
  ): Promise<FindUserByEmailRepositoryOutputDto | null>;
}
