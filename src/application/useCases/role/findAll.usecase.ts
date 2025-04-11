import { Injectable, Inject } from '@nestjs/common';
import { FindAllUseCaseOutputDto } from '@application/dtos/useCases/role/findAll.dto';
import {
  LOGGER_SERVICE_TOKEN,
  LoggerServiceInterface,
} from '@application/services/logger.service';
import {
  ROLE_REPOSITORY_TOKEN,
  RoleRepositoryInterface,
} from '@application/repositories/role.repository';

@Injectable()
export class FindAllRolesUseCase {
  constructor(
    @Inject(LOGGER_SERVICE_TOKEN)
    private readonly loggerService: LoggerServiceInterface,

    @Inject(ROLE_REPOSITORY_TOKEN)
    private readonly roleRepository: RoleRepositoryInterface,
  ) {}

  async run(): Promise<FindAllUseCaseOutputDto> {
    this.loggerService.info('START FindAllRolesUseCase');

    const output = await this.roleRepository.findAll();
    this.loggerService.debug('output', output);

    this.loggerService.info('FINISH FindAllRolesUseCase');
    return output;
  }
}
