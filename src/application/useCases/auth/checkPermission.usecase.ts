import { Injectable, Inject } from '@nestjs/common';
import { CheckPermissionUseCaseInputDto } from '@application/dtos/useCases/auth/checkPermission.dto';
import {
  LOGGER_SERVICE_TOKEN,
  LoggerServiceInterface,
} from '@application/services/logger.service';
import { BusinessException } from '@application/exceptions/business.exception';

@Injectable()
export class CheckPermissionUseCase {
  constructor(
    @Inject(LOGGER_SERVICE_TOKEN)
    private readonly loggerService: LoggerServiceInterface,
  ) {}

  async run(input: CheckPermissionUseCaseInputDto): Promise<void> {
    this.loggerService.info('START CheckPermissionUseCase');
    this.loggerService.debug('input', input);

    const expectedPermission = input.expectedPermission;
    const userPermissions = input.userPermissions;
    const hasPermission = userPermissions.some(
      (userPermission) => userPermission === expectedPermission,
    );
    this.loggerService.debug('hasPermission', hasPermission);

    if (!hasPermission)
      throw new BusinessException('Access to this resource was denied');

    this.loggerService.info('FINISH CheckPermissionUseCase');
  }
}
