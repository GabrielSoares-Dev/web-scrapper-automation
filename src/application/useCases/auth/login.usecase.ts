import { Injectable, Inject } from '@nestjs/common';
import {
  LoginUseCaseInputDto,
  LoginUseCaseOutputDto,
} from '@application/dtos/useCases/auth/login.dto';
import {
  LOGGER_SERVICE_TOKEN,
  LoggerServiceInterface,
} from '@application/services/logger.service';
import {
  AUTH_SERVICE_TOKEN,
  AuthServiceInterface,
} from '@application/services/auth.service';
import {
  CRYPTOGRAPHY_SERVICE_TOKEN,
  CryptographyServiceInterface,
} from '@application/services/cryptography.service';
import {
  USER_REPOSITORY_TOKEN,
  UserRepositoryInterface,
} from '@application/repositories/user.repository';
import { FindUserByEmailRepositoryOutputDto } from '@application/dtos/repositories/user/findByEmail.dto';
import { BusinessException } from '@application/exceptions/business.exception';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(LOGGER_SERVICE_TOKEN)
    private readonly loggerService: LoggerServiceInterface,

    @Inject(AUTH_SERVICE_TOKEN)
    private readonly authService: AuthServiceInterface,

    @Inject(CRYPTOGRAPHY_SERVICE_TOKEN)
    private readonly cryptographyService: CryptographyServiceInterface,

    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  protected async foundUser(
    email: string,
  ): Promise<FindUserByEmailRepositoryOutputDto> {
    const user = await this.userRepository.findByEmail(email);
    this.loggerService.debug('User found', user);

    if (!user) throw new BusinessException('Invalid credentials');

    return user;
  }

  protected async validatePassword(
    incoming: string,
    encrypted: string,
  ): Promise<void> {
    const isValid = await this.cryptographyService.compare(incoming, encrypted);
    this.loggerService.debug('Password validation result', isValid);

    if (!isValid) throw new BusinessException('Invalid credentials');
  }

  protected async generateToken(
    input: FindUserByEmailRepositoryOutputDto,
  ): Promise<string> {
    const payload = {
      id: input.id,
      name: input.name,
      email: input.email,
      phoneNumber: input.phoneNumber,
      role: input.role,
      permissions: input.permissions,
    };

    return this.authService.generateToken(payload);
  }

  async run(input: LoginUseCaseInputDto): Promise<LoginUseCaseOutputDto> {
    this.loggerService.info('START LoginUseCase');
    this.loggerService.debug('input', input);

    const user = await this.foundUser(input.email);

    const incomingPassword = input.password;
    const encriptedPassword = user.password;

    await this.validatePassword(incomingPassword, encriptedPassword);

    const token = await this.generateToken(user);
    this.loggerService.debug('token', token);

    const output = {
      token,
    };

    this.loggerService.debug('output', output);
    this.loggerService.info('FINISH LoginUseCase');

    return output;
  }
}
