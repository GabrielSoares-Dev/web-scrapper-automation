import { Injectable, Inject } from '@nestjs/common';
import { CheckAuthenticationUseCaseInputDto } from '@application/dtos/useCases/auth/checkAuthentication.dto';
import {
  LOGGER_SERVICE_TOKEN,
  LoggerServiceInterface,
} from '@application/services/logger.service';
import {
  AUTH_SERVICE_TOKEN,
  AuthServiceInterface,
} from '@application/services/auth.service';
import { BusinessException } from '@application/exceptions/business.exception';

@Injectable()
export class CheckAuthenticationUseCase {
  constructor(
    @Inject(LOGGER_SERVICE_TOKEN)
    private readonly loggerService: LoggerServiceInterface,

    @Inject(AUTH_SERVICE_TOKEN)
    private readonly authService: AuthServiceInterface,
  ) {}

  async run(input: CheckAuthenticationUseCaseInputDto): Promise<object> {
    this.loggerService.info('START CheckAuthenticationUseCase');
    this.loggerService.debug('input', input);

    const token = input.token;

    if (!token) throw new BusinessException('Unauthorized');

    try {
      const tokenPayload = await this.authService.verifyToken(token);
      this.loggerService.debug('tokenPayload', tokenPayload);
      this.loggerService.info('FINISH CheckAuthenticationUseCase');
      return tokenPayload;
    } catch {
      this.loggerService.info('FINISH CheckAuthenticationUseCase');
      throw new BusinessException('Unauthorized');
    }
  }
}
