import { Module } from '@nestjs/common';
import { PermissionController } from '@infra/http/controllers/permission.controller';
import { CreatePermissionUseCase } from '@application/useCases/permission/create.usecase';
import { FindAllPermissionsUseCase } from '@application/useCases/permission/findAll.usecase';
import { FindPermissionUseCase } from '@application/useCases/permission/find.usecase';
import { UpdatePermissionUseCase } from '@application/useCases/permission/update.usecase';
import { DeletePermissionUseCase } from '@application/useCases/permission/delete.usecase';
import { PERMISSION_REPOSITORY_TOKEN } from '@application/repositories/permission.repository';
import { PermissionRepository } from '@infra/repositories/permission.repository';

@Module({
  controllers: [PermissionController],
  providers: [
    CreatePermissionUseCase,
    FindAllPermissionsUseCase,
    FindPermissionUseCase,
    UpdatePermissionUseCase,
    DeletePermissionUseCase,
    {
      provide: PERMISSION_REPOSITORY_TOKEN,
      useClass: PermissionRepository,
    },
  ],
  exports: [PERMISSION_REPOSITORY_TOKEN],
})
export class PermissionModule {}
