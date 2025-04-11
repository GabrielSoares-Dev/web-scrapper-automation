import {
  CreatePermissionRepositoryInputDto,
  CreatePermissionRepositoryOutputDto,
} from '@application/dtos/repositories/permission/create.dto';
import {
  UpdatePermissionRepositoryInputDto,
  UpdatePermissionRepositoryOutputDto,
} from '@application/dtos/repositories/permission/update.dto';
import { FindPermissionByNameRepositoryOutputDto } from '@application/dtos/repositories/permission/findByName.dto';
import { FindAllPermissionsRepositoryOutputDto } from '@application/dtos/repositories/permission/findAll.dto';
import { FindPermissionRepositoryOutputDto } from '@application/dtos/repositories/permission/find.dto';
import { DeletePermissionRepositoryOutputDto } from '@application/dtos/repositories/permission/delete.dto';

export const PERMISSION_REPOSITORY_TOKEN = 'PERMISSION_REPOSITORY_TOKEN';

export interface PermissionRepositoryInterface {
  create(
    input: CreatePermissionRepositoryInputDto,
  ): Promise<CreatePermissionRepositoryOutputDto>;
  update(
    input: UpdatePermissionRepositoryInputDto,
  ): Promise<UpdatePermissionRepositoryOutputDto>;
  findByName(name: string): Promise<FindPermissionByNameRepositoryOutputDto>;
  findAll(): Promise<FindAllPermissionsRepositoryOutputDto>;
  find(id: number): Promise<FindPermissionRepositoryOutputDto>;
  delete(id: number): Promise<DeletePermissionRepositoryOutputDto>;
}
