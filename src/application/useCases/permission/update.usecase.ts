import { Injectable, Inject } from '@nestjs/common';
import {
  LOGGER_SERVICE_TOKEN,
  LoggerServiceInterface,
} from '@application/services/logger.service';
import { UpdateUseCaseInputDto } from '@application/dtos/useCases/permission/update.dto';
import {
  PERMISSION_REPOSITORY_TOKEN,
  PermissionRepositoryInterface,
} from '@application/repositories/permission.repository';
import { BusinessException } from '@application/exceptions/business.exception';

@Injectable()
export class UpdatePermissionUseCase {
  constructor(
    @Inject(LOGGER_SERVICE_TOKEN)
    private readonly loggerService: LoggerServiceInterface,

    @Inject(PERMISSION_REPOSITORY_TOKEN)
    private readonly permissionRepository: PermissionRepositoryInterface,
  ) {}

  async run(input: UpdateUseCaseInputDto): Promise<void> {
    this.loggerService.info('START UpdatePermissionUseCase');
    this.loggerService.debug('input', input);

    const foundPermission = await this.permissionRepository.find(input.id);
    this.loggerService.debug('foundPermission', foundPermission);

    if (!foundPermission) throw new BusinessException('Invalid id');

    const updated = await this.permissionRepository.update(input);
    this.loggerService.debug('updated', updated);

    this.loggerService.info('FINISH UpdatePermissionUseCase');
  }
}
