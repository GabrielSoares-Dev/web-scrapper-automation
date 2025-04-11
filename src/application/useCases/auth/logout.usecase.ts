import { Injectable, Inject } from '@nestjs/common';
import { LogoutUseCaseInputDto } from '@application/dtos/useCases/auth/logout.dto';
import {
  LOGGER_SERVICE_TOKEN,
  LoggerServiceInterface,
} from '@application/services/logger.service';
import {
  AUTH_SERVICE_TOKEN,
  AuthServiceInterface,
} from '@application/services/auth.service';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(LOGGER_SERVICE_TOKEN)
    private readonly loggerService: LoggerServiceInterface,

    @Inject(AUTH_SERVICE_TOKEN)
    private readonly authService: AuthServiceInterface,
  ) {}

  async run(input: LogoutUseCaseInputDto): Promise<void> {
    this.loggerService.info('START LogoutUseCase');
    this.loggerService.debug('input', input);

    await this.authService.invalidateToken(input.token);
    this.loggerService.info('Invalidate token');

    this.loggerService.info('FINISH LogoutUseCase');
  }
}
