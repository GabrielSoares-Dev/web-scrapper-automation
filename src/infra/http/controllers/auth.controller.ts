import {
  Controller,
  Post,
  Inject,
  Res,
  HttpStatus,
  HttpException,
  Body,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@infra/http/guards/auth.guard';
import { LoginSerializerInputDto } from '@infra/http/serializers/auth/login.serializer';
import {
  LOGGER_SERVICE_TOKEN,
  LoggerServiceInterface,
} from '@application/services/logger.service';
import { LoginUseCase } from '@application/useCases/auth/login.usecase';
import { LogoutUseCase } from '@application/useCases/auth/logout.usecase';
import { Response, Request } from 'express';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    @Inject(LOGGER_SERVICE_TOKEN)
    private readonly loggerService: LoggerServiceInterface,
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  private readonly context = 'AuthController';

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() input: LoginSerializerInputDto, @Res() res: Response) {
    this.loggerService.info(`START ${this.context} login`);
    this.loggerService.debug('input', input);
    try {
      const output = await this.loginUseCase.run(input);
      this.loggerService.debug('output', output);

      this.loggerService.info(`FINISH ${this.context} login`);

      const response = {
        statusCode: HttpStatus.OK,
        message: 'Authenticated',
        content: output,
      };
      return res.json(response);
    } catch (error) {
      const errorMessage = error.message;
      let httpCode = HttpStatus.INTERNAL_SERVER_ERROR;

      const isInvalidCredentialsError = errorMessage === 'Invalid credentials';
      if (isInvalidCredentialsError) httpCode = HttpStatus.UNAUTHORIZED;

      this.loggerService.error('error', errorMessage);
      throw new HttpException(errorMessage, httpCode);
    }
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res() res: Response) {
    this.loggerService.info(`START ${this.context} logout`);
    try {
      const token = req.headers.authorization?.split(' ')[1];
      await this.logoutUseCase.run({ token });

      this.loggerService.info(`FINISH ${this.context} logout`);

      const response = {
        statusCode: HttpStatus.OK,
        message: 'Successfully logged out',
      };
      return res.json(response);
    } catch (error) {
      const errorMessage = error.message;
      const httpCode = HttpStatus.INTERNAL_SERVER_ERROR;

      this.loggerService.error('error', errorMessage);
      throw new HttpException(errorMessage, httpCode);
    }
  }
}
