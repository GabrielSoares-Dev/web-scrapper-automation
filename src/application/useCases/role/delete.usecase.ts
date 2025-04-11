import { Injectable, Inject } from '@nestjs/common';
import {
  LOGGER_SERVICE_TOKEN,
  LoggerServiceInterface,
} from '@application/services/logger.service';
import { DeleteRoleUseCaseInputDto } from '@application/dtos/useCases/role/delete.dto';
import {
  ROLE_REPOSITORY_TOKEN,
  RoleRepositoryInterface,
} from '@application/repositories/role.repository';
import { BusinessException } from '@application/exceptions/business.exception';

@Injectable()
export class DeleteRoleUseCase {
  constructor(
    @Inject(LOGGER_SERVICE_TOKEN)
    private readonly loggerService: LoggerServiceInterface,

    @Inject(ROLE_REPOSITORY_TOKEN)
    private readonly roleRepository: RoleRepositoryInterface,
  ) {}

  async run(input: DeleteRoleUseCaseInputDto): Promise<void> {
    this.loggerService.info('START DeleteRoleUseCase');
    this.loggerService.debug('input', input);

    const foundRole = await this.roleRepository.find(input.id);
    this.loggerService.debug('foundRole', foundRole);

    if (!foundRole) throw new BusinessException('Invalid id');

    const deleted = await this.roleRepository.delete(input.id);
    this.loggerService.debug('deleted', deleted);

    this.loggerService.info('FINISH DeleteRoleUseCase');
  }
}
