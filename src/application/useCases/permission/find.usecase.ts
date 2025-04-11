import { Injectable, Inject } from '@nestjs/common';
import {
  LOGGER_SERVICE_TOKEN,
  LoggerServiceInterface,
} from '@application/services/logger.service';
import {
  FindUseCaseInputDto,
  FindUseCaseOutputDto,
} from '@application/dtos/useCases/permission/find.dto';
import {
  PERMISSION_REPOSITORY_TOKEN,
  PermissionRepositoryInterface,
} from '@application/repositories/permission.repository';
import { BusinessException } from '@application/exceptions/business.exception';

@Injectable()
export class FindPermissionUseCase {
  constructor(
    @Inject(LOGGER_SERVICE_TOKEN)
    private readonly loggerService: LoggerServiceInterface,

    @Inject(PERMISSION_REPOSITORY_TOKEN)
    private readonly permissionRepository: PermissionRepositoryInterface,
  ) {}

  async run(input: FindUseCaseInputDto): Promise<FindUseCaseOutputDto> {
    this.loggerService.info('START FindPermissionUseCase');

    const output = await this.permissionRepository.find(input.id);
    this.loggerService.debug('output', output);

    if (!output) throw new BusinessException('Invalid id');

    this.loggerService.info('FINISH FindPermissionUseCase');
    return output;
  }
}
