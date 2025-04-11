import { Injectable, Inject } from '@nestjs/common';
import { Role } from '@domain/entities/role.entity';
import { CreateRoleUseCaseInputDto } from '@application/dtos/useCases/role/create.dto';
import {
  LOGGER_SERVICE_TOKEN,
  LoggerServiceInterface,
} from '@application/services/logger.service';
import {
  ROLE_REPOSITORY_TOKEN,
  RoleRepositoryInterface,
} from '@application/repositories/role.repository';
import { BusinessException } from '@application/exceptions/business.exception';

@Injectable()
export class CreateRoleUseCase {
  constructor(
    @Inject(LOGGER_SERVICE_TOKEN)
    private readonly loggerService: LoggerServiceInterface,

    @Inject(ROLE_REPOSITORY_TOKEN)
    private readonly roleRepository: RoleRepositoryInterface,
  ) {}

  protected validate(input: CreateRoleUseCaseInputDto): void {
    const entity = new Role(input);

    entity.create();
  }

  async run(input: CreateRoleUseCaseInputDto): Promise<void> {
    this.loggerService.info('START CreateRoleUseCase');
    this.loggerService.debug('input', input);

    this.validate(input);

    const alreadyExists = await this.roleRepository.findByName(input.name);
    this.loggerService.debug('alreadyExists', alreadyExists);

    if (alreadyExists) throw new BusinessException('Role already exists');

    const created = await this.roleRepository.create(input);
    this.loggerService.debug('created', created);

    this.loggerService.info('FINISH CreateRoleUseCase');
  }
}
