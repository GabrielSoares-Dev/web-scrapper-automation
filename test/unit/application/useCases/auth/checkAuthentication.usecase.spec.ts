import { Test, TestingModule } from '@nestjs/testing';
import { CheckAuthenticationUseCase } from '@application/useCases/auth/checkAuthentication.usecase';
import {
  AUTH_SERVICE_TOKEN,
  AuthServiceInterface,
} from '@application/services/auth.service';
import { loggerMock } from '@test/helpers/mocks/logger.mock';

const input = {
  token: 'testing',
};

describe('CheckAuthenticationUseCase', () => {
  let useCase: CheckAuthenticationUseCase;
  let authService: AuthServiceInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckAuthenticationUseCase,
        {
          provide: AUTH_SERVICE_TOKEN,
          useValue: {
            verifyToken: jest.fn().mockResolvedValue({ name: 'test' }),
          },
        },

        { ...loggerMock },
      ],
    }).compile();

    useCase = module.get<CheckAuthenticationUseCase>(
      CheckAuthenticationUseCase,
    );
    authService = module.get<AuthServiceInterface>(AUTH_SERVICE_TOKEN);
  });

  it('Should be is authorized', async () => {
    const verfiyTokenSpyOn = jest.spyOn(authService, 'verifyToken');

    const output = await useCase.run(input);
    const expectedOutput = { name: 'test' };
    expect(output).toEqual(expectedOutput);
    expect(verfiyTokenSpyOn).toHaveBeenCalledWith('testing');
  });

  it('Should be is unauthorized without token', async () => {
    await expect(useCase.run({})).rejects.toThrow('Unauthorized');
  });

  it('Should be is unauthorized by invalid token', async () => {
    const verfiyTokenSpyOn = jest
      .spyOn(authService, 'verifyToken')
      .mockRejectedValue('invalid');

    await expect(useCase.run(input)).rejects.toThrow('Unauthorized');

    expect(verfiyTokenSpyOn).toHaveBeenCalledWith('testing');
  });
});
