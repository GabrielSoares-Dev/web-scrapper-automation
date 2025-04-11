import { Injectable, Inject } from '@nestjs/common';
import { Permission } from '@domain/entities/permission.entity';
import { CreatePermissionUseCaseInputDto } from '@application/dtos/useCases/permission/create.dto';
import {
  LOGGER_SERVICE_TOKEN,
  LoggerServiceInterface,
} from '@application/services/logger.service';
import {
  PERMISSION_REPOSITORY_TOKEN,
  PermissionRepositoryInterface,
} from '@application/repositories/permission.repository';
import { BusinessException } from '@application/exceptions/business.exception';

@Injectable()
export class CreatePermissionUseCase {
  constructor(
    @Inject(LOGGER_SERVICE_TOKEN)
    private readonly loggerService: LoggerServiceInterface,

    @Inject(PERMISSION_REPOSITORY_TOKEN)
    private readonly permissionRepository: PermissionRepositoryInterface,
  ) {}

  protected validate(input: CreatePermissionUseCaseInputDto): void {
    const entity = new Permission(input);

    entity.create();
  }

  async run(input: CreatePermissionUseCaseInputDto): Promise<void> {
    this.loggerService.info('START CreatePermissionUseCase');
    this.loggerService.debug('input', input);

    this.validate(input);

    const alreadyExists = await this.permissionRepository.findByName(
      input.name,
    );
    this.loggerService.debug('alreadyExists', alreadyExists);

    if (alreadyExists) throw new BusinessException('Permission already exists');

    const created = await this.permissionRepository.create(input);
    this.loggerService.debug('created', created);

    this.loggerService.info('FINISH CreatePermissionUseCase');
  }
}
