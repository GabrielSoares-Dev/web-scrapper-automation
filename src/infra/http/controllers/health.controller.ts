import {
  Controller,
  Inject,
  Res,
  HttpStatus,
  HttpException,
  HttpCode,
  Get,
} from '@nestjs/common';
import {
  LOGGER_SERVICE_TOKEN,
  LoggerServiceInterface,
} from '@application/services/logger.service';
import { Response } from 'express';

@Controller({ path: 'health' })
export class HealthController {
  constructor(
    @Inject(LOGGER_SERVICE_TOKEN)
    private readonly loggerService: LoggerServiceInterface,
  ) {}

  private readonly context = 'HealthController';

  @Get()
  @HttpCode(HttpStatus.OK)
  async health(@Res() res: Response) {
    this.loggerService.info(`START ${this.context} health`);
    try {
      const response = {
        statusCode: HttpStatus.OK,
        message: 'Server is running',
      };
      this.loggerService.info(`FINISH ${this.context} health`);
      return res.json(response);
    } catch (error) {
      const errorMessage = error.message;
      const httpCode = HttpStatus.INTERNAL_SERVER_ERROR;

      this.loggerService.error('error', errorMessage);
      throw new HttpException(errorMessage, httpCode);
    }
  }
}
