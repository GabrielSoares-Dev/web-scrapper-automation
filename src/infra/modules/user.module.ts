import { Module } from '@nestjs/common';
import { RoleModule } from '@infra/modules/role.module';
import { CryptographyModule } from '@infra/modules/cryptography.module';
import { CreateUserUseCase } from '@application/useCases/user/create.usecase';
import { USER_REPOSITORY_TOKEN } from '@application/repositories/user.repository';
import { UserController } from '@infra/http/controllers/user.controller';
import { UserRepository } from '@infra/repositories/user.repository';

@Module({
  imports: [RoleModule, CryptographyModule],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepository,
    },
  ],
  exports: [USER_REPOSITORY_TOKEN],
})
export class UserModule {}
