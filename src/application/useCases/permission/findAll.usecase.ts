import { Injectable, Inject } from '@nestjs/common';
import { FindAllUseCaseOutputDto } from '@application/dtos/useCases/permission/findAll.dto';
import {
  LOGGER_SERVICE_TOKEN,
  LoggerServiceInterface,
} from '@application/services/logger.service';
import {
  PERMISSION_REPOSITORY_TOKEN,
  PermissionRepositoryInterface,
} from '@application/repositories/permission.repository';

@Injectable()
export class FindAllPermissionsUseCase {
  constructor(
    @Inject(LOGGER_SERVICE_TOKEN)
    private readonly loggerService: LoggerServiceInterface,

    @Inject(PERMISSION_REPOSITORY_TOKEN)
    private readonly permissionRepository: PermissionRepositoryInterface,
  ) {}

  async run(): Promise<FindAllUseCaseOutputDto> {
    this.loggerService.info('START FindAllPermissionsUseCase');

    const output = await this.permissionRepository.findAll();
    this.loggerService.debug('output', output);

    this.loggerService.info('FINISH FindAllPermissionsUseCase');
    return output;
  }
}
