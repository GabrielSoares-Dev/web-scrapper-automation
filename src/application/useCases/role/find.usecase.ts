import { Injectable, Inject } from '@nestjs/common';
import {
  LOGGER_SERVICE_TOKEN,
  LoggerServiceInterface,
} from '@application/services/logger.service';
import {
  FindUseCaseInputDto,
  FindUseCaseOutputDto,
} from '@application/dtos/useCases/role/find.dto';
import {
  ROLE_REPOSITORY_TOKEN,
  RoleRepositoryInterface,
} from '@application/repositories/role.repository';
import { BusinessException } from '@application/exceptions/business.exception';

@Injectable()
export class FindRoleUseCase {
  constructor(
    @Inject(LOGGER_SERVICE_TOKEN)
    private readonly loggerService: LoggerServiceInterface,

    @Inject(ROLE_REPOSITORY_TOKEN)
    private readonly roleRepository: RoleRepositoryInterface,
  ) {}

  async run(input: FindUseCaseInputDto): Promise<FindUseCaseOutputDto> {
    this.loggerService.info('START FindRoleUseCase');

    const output = await this.roleRepository.find(input.id);
    this.loggerService.debug('output', output);

    if (!output) throw new BusinessException('Invalid id');

    this.loggerService.info('FINISH FindRoleUseCase');
    return output;
  }
}
