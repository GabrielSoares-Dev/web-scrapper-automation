import { Test, TestingModule } from '@nestjs/testing';
import { LogoutUseCase } from '@application/useCases/auth/logout.usecase';
import {
  AUTH_SERVICE_TOKEN,
  AuthServiceInterface,
} from '@application/services/auth.service';
import { loggerMock } from '@test/helpers/mocks/logger.mock';

const input = {
  token: 'testing',
};

describe('LogoutUseCase', () => {
  let useCase: LogoutUseCase;
  let authService: AuthServiceInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogoutUseCase,
        {
          provide: AUTH_SERVICE_TOKEN,
          useValue: {
            invalidateToken: jest.fn(),
          },
        },

        { ...loggerMock },
      ],
    }).compile();

    useCase = module.get<LogoutUseCase>(LogoutUseCase);
    authService = module.get<AuthServiceInterface>(AUTH_SERVICE_TOKEN);
  });

  it('Should be logout', async () => {
    const invalidateTokenSpyOn = jest.spyOn(authService, 'invalidateToken');

    await useCase.run(input);
    expect(invalidateTokenSpyOn).toHaveBeenCalledWith('testing');
  });
});
