import { Injectable, Inject } from '@nestjs/common';
import {
  LOGGER_SERVICE_TOKEN,
  LoggerServiceInterface,
} from '@application/services/logger.service';
import { DeletePermissionUseCaseInputDto } from '@application/dtos/useCases/permission/delete.dto';
import {
  PERMISSION_REPOSITORY_TOKEN,
  PermissionRepositoryInterface,
} from '@application/repositories/permission.repository';
import { BusinessException } from '@application/exceptions/business.exception';

@Injectable()
export class DeletePermissionUseCase {
  constructor(
    @Inject(LOGGER_SERVICE_TOKEN)
    private readonly loggerService: LoggerServiceInterface,

    @Inject(PERMISSION_REPOSITORY_TOKEN)
    private readonly permissionRepository: PermissionRepositoryInterface,
  ) {}

  async run(input: DeletePermissionUseCaseInputDto): Promise<void> {
    this.loggerService.info('START DeletePermissionUseCase');
    this.loggerService.debug('input', input);

    const foundPermission = await this.permissionRepository.find(input.id);
    this.loggerService.debug('foundPermission', foundPermission);

    if (!foundPermission) throw new BusinessException('Invalid id');

    const deleted = await this.permissionRepository.delete(input.id);
    this.loggerService.debug('deleted', deleted);

    this.loggerService.info('FINISH DeletePermissionUseCase');
  }
}
