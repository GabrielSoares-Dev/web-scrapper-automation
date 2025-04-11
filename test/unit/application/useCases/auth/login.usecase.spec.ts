import { Test, TestingModule } from '@nestjs/testing';
import { LoginUseCase } from '@application/useCases/auth/login.usecase';
import { Role } from '@domain/enums/role.enum';
import {
  CRYPTOGRAPHY_SERVICE_TOKEN,
  CryptographyServiceInterface,
} from '@application/services/cryptography.service';
import {
  AUTH_SERVICE_TOKEN,
  AuthServiceInterface,
} from '@application/services/auth.service';
import {
  USER_REPOSITORY_TOKEN,
  UserRepositoryInterface,
} from '@application/repositories/user.repository';
import { loggerMock } from '@test/helpers/mocks/logger.mock';

const input = {
  email: 'test@gmail.com',
  password: 'Test@2312',
};

const mockFindUserByEmailOutput = {
  id: 1,
  name: 'test',
  email: 'test@gmail.com',
  phoneNumber: '11991742156',
  password: '$2b$10$QTwuafopwnOX1K/XkbqwGe393FnJmeTim3gPocZ0wXPngfD/F1s0y',
  createdAt: new Date(),
  updatedAt: new Date(),
  role: Role.ADMIN,
  permissions: ['test'],
};

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let userRepository: UserRepositoryInterface;
  let cryptographyService: CryptographyServiceInterface;
  let authService: AuthServiceInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            findByEmail: jest.fn().mockResolvedValue(mockFindUserByEmailOutput),
          },
        },
        {
          provide: CRYPTOGRAPHY_SERVICE_TOKEN,
          useValue: {
            compare: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: AUTH_SERVICE_TOKEN,
          useValue: {
            generateToken: jest.fn().mockResolvedValue('mock-token'),
          },
        },

        { ...loggerMock },
      ],
    }).compile();

    useCase = module.get<LoginUseCase>(LoginUseCase);
    userRepository = module.get<UserRepositoryInterface>(USER_REPOSITORY_TOKEN);
    authService = module.get<AuthServiceInterface>(AUTH_SERVICE_TOKEN);
    cryptographyService = module.get<CryptographyServiceInterface>(
      CRYPTOGRAPHY_SERVICE_TOKEN,
    );
  });

  it('Should be authenticated', async () => {
    const findByEmailSpyOn = jest.spyOn(userRepository, 'findByEmail');
    const comparePasswordSpyOn = jest.spyOn(cryptographyService, 'compare');
    const generateTokenSpyOn = jest.spyOn(authService, 'generateToken');

    const output = await useCase.run(input);

    const expectedOutput = {
      token: 'mock-token',
    };

    expect(output).toEqual(expectedOutput);

    const expectedInputFindByEmail = 'test@gmail.com';

    expect(findByEmailSpyOn).toHaveBeenCalledWith(expectedInputFindByEmail);

    const expectedInputComparePassword = {
      value: 'Test@2312',
      encrypted: '$2b$10$QTwuafopwnOX1K/XkbqwGe393FnJmeTim3gPocZ0wXPngfD/F1s0y',
    };

    expect(comparePasswordSpyOn).toHaveBeenCalledWith(
      expectedInputComparePassword.value,
      expectedInputComparePassword.encrypted,
    );

    const expectedInputGenerateToken = {
      id: 1,
      name: 'test',
      email: 'test@gmail.com',
      phoneNumber: '11991742156',
      role: Role.ADMIN,
      permissions: ['test'],
    };

    expect(generateTokenSpyOn).toHaveBeenCalledWith(expectedInputGenerateToken);
  });

  it('Should be invalid credentials because user not found', async () => {
    const findByEmailSpyOn = jest
      .spyOn(userRepository, 'findByEmail')
      .mockResolvedValue(null);
    const comparePasswordSpyOn = jest.spyOn(cryptographyService, 'compare');
    const generateTokenSpyOn = jest.spyOn(authService, 'generateToken');

    await expect(useCase.run(input)).rejects.toThrow('Invalid credentials');

    const expectedInputFindByEmail = 'test@gmail.com';

    expect(findByEmailSpyOn).toHaveBeenCalledWith(expectedInputFindByEmail);
    expect(comparePasswordSpyOn).not.toHaveBeenCalled();
    expect(generateTokenSpyOn).not.toHaveBeenCalled();
  });

  it('Should be invalid credentials because is incorrect password', async () => {
    const findByEmailSpyOn = jest.spyOn(userRepository, 'findByEmail');
    const comparePasswordSpyOn = jest
      .spyOn(cryptographyService, 'compare')
      .mockResolvedValue(false);
    const generateTokenSpyOn = jest.spyOn(authService, 'generateToken');

    await expect(useCase.run(input)).rejects.toThrow('Invalid credentials');

    const expectedInputFindByEmail = 'test@gmail.com';

    expect(findByEmailSpyOn).toHaveBeenCalledWith(expectedInputFindByEmail);

    const expectedInputComparePassword = {
      value: 'Test@2312',
      encrypted: '$2b$10$QTwuafopwnOX1K/XkbqwGe393FnJmeTim3gPocZ0wXPngfD/F1s0y',
    };
    expect(comparePasswordSpyOn).toHaveBeenCalledWith(
      expectedInputComparePassword.value,
      expectedInputComparePassword.encrypted,
    );
    expect(generateTokenSpyOn).not.toHaveBeenCalled();
  });
});
