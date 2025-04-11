import { Module } from '@nestjs/common';
import { RoleController } from '@infra/http/controllers/role.controller';
import { PermissionModule } from '@infra/modules/permission.module';
import { CreateRoleUseCase } from '@application/useCases/role/create.usecase';
import { FindAllRolesUseCase } from '@application/useCases/role/findAll.usecase';
import { FindRoleUseCase } from '@application/useCases/role/find.usecase';
import { UpdateRoleUseCase } from '@application/useCases/role/update.usecase';
import { DeleteRoleUseCase } from '@application/useCases/role/delete.usecase';
import { SyncPermissionsUseCase } from '@application/useCases/role/syncPermissions.usecase';
import { UnsyncPermissionsUseCase } from '@application/useCases/role/unsyncPermissions.usecase';
import { ROLE_REPOSITORY_TOKEN } from '@application/repositories/role.repository';
import { RoleRepository } from '@infra/repositories/role.repository';

@Module({
  imports: [PermissionModule],
  controllers: [RoleController],
  providers: [
    CreateRoleUseCase,
    FindAllRolesUseCase,
    FindRoleUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,
    SyncPermissionsUseCase,
    UnsyncPermissionsUseCase,
    {
      provide: ROLE_REPOSITORY_TOKEN,
      useClass: RoleRepository,
    },
  ],
  exports: [ROLE_REPOSITORY_TOKEN],
})
export class RoleModule {}
