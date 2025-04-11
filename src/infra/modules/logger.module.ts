import { Module, Global } from '@nestjs/common';
import { LoggerService } from '@infra/services/logger.service';
import { LOGGER_SERVICE_TOKEN } from '@application/services/logger.service';

@Global()
@Module({
  providers: [{ provide: LOGGER_SERVICE_TOKEN, useClass: LoggerService }],
  exports: [LOGGER_SERVICE_TOKEN],
})
export class LoggerModule {}
