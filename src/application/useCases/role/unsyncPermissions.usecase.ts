import { Injectable, Inject } from '@nestjs/common';
import { UnyncPermissionsUseCaseInputDto } from '@application/dtos/useCases/role/unsyncPermissions.dto';
import {
  LOGGER_SERVICE_TOKEN,
  LoggerServiceInterface,
} from '@application/services/logger.service';
import {
  ROLE_REPOSITORY_TOKEN,
  RoleRepositoryInterface,
} from '@application/repositories/role.repository';
import {
  PERMISSION_REPOSITORY_TOKEN,
  PermissionRepositoryInterface,
} from '@application/repositories/permission.repository';
import { BusinessException } from '@application/exceptions/business.exception';

@Injectable()
export class UnsyncPermissionsUseCase {
  constructor(
    @Inject(LOGGER_SERVICE_TOKEN)
    private readonly loggerService: LoggerServiceInterface,

    @Inject(ROLE_REPOSITORY_TOKEN)
    private readonly roleRepository: RoleRepositoryInterface,

    @Inject(PERMISSION_REPOSITORY_TOKEN)
    private readonly permissionRepository: PermissionRepositoryInterface,
  ) {}

  protected async processPermissionIds(
    permissions: string[],
  ): Promise<number[]> {
    const processPermissions = permissions.map(async (permission) => {
      const foundPermission =
        await this.permissionRepository.findByName(permission);
      this.loggerService.debug('foundPermission', foundPermission);

      if (!foundPermission) throw new BusinessException('Invalid permission');

      return foundPermission.id;
    });

    return Promise.all(processPermissions);
  }

  async run(input: UnyncPermissionsUseCaseInputDto): Promise<void> {
    this.loggerService.info('START UnsyncPermissionsUseCase');
    this.loggerService.debug('input', input);

    const foundRole = await this.roleRepository.findByName(input.role);
    this.loggerService.debug('foundRole', foundRole);

    if (!foundRole) throw new BusinessException('Invalid role');

    const roleId = foundRole.id;
    this.loggerService.debug('roleId', roleId);

    const permissionIds = await this.processPermissionIds(input.permissions);
    this.loggerService.debug('permissionIds', permissionIds);

    const unsyncResult = await this.roleRepository.unsyncPermissions({
      roleId,
      permissionIds,
    });
    this.loggerService.debug('unsyncResult', unsyncResult);

    this.loggerService.info('FINISH UnsyncPermissionsUseCase');
  }
}
