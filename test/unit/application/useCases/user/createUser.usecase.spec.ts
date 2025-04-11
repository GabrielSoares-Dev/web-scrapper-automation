import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from '@application/useCases/user/create.usecase';
import { Role } from '@domain/enums/role.enum';
import {
  CRYPTOGRAPHY_SERVICE_TOKEN,
  CryptographyServiceInterface,
} from '@application/services/cryptography.service';
import {
  USER_REPOSITORY_TOKEN,
  UserRepositoryInterface,
} from '@application/repositories/user.repository';
import {
  ROLE_REPOSITORY_TOKEN,
  RoleRepositoryInterface,
} from '@application/repositories/role.repository';
import { loggerMock } from '@test/helpers/mocks/logger.mock';

const input = {
  name: 'test',
  email: 'test@gmail.com',
  password: 'Test@2312',
  phoneNumber: '11991742156',
};

const mockFindByNameOutput = {
  id: 1,
  name: Role.ADMIN,
  description: 'test',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: UserRepositoryInterface;
  let roleRepository: RoleRepositoryInterface;
  let cryptographyService: CryptographyServiceInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn().mockResolvedValue(null),
          },
        },
        {
          provide: ROLE_REPOSITORY_TOKEN,
          useValue: {
            findByName: jest.fn().mockResolvedValue(mockFindByNameOutput),
          },
        },
        {
          provide: CRYPTOGRAPHY_SERVICE_TOKEN,
          useValue: {
            encrypt: jest
              .fn()
              .mockResolvedValue(
                '$2b$10$QTwuafopwnOX1K/XkbqwGe393FnJmeTim3gPocZ0wXPngfD/F1s0y',
              ),
          },
        },
        { ...loggerMock },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    userRepository = module.get<UserRepositoryInterface>(USER_REPOSITORY_TOKEN);
    roleRepository = module.get<RoleRepositoryInterface>(ROLE_REPOSITORY_TOKEN);
    cryptographyService = module.get<CryptographyServiceInterface>(
      CRYPTOGRAPHY_SERVICE_TOKEN,
    );
  });

  it('Should be create user', async () => {
    const findRoleByNameSpyOn = jest.spyOn(roleRepository, 'findByName');
    const createSpyOn = jest.spyOn(userRepository, 'create');
    const encryptSpyOn = jest.spyOn(cryptographyService, 'encrypt');

    await useCase.run(input);

    const expectedInputFindRoleByName = Role.ADMIN;
    expect(findRoleByNameSpyOn).toHaveBeenCalledWith(
      expectedInputFindRoleByName,
    );

    const expectedInputEncrypt = 'Test@2312';
    expect(encryptSpyOn).toHaveBeenCalledWith(expectedInputEncrypt);

    const expectedInputCreate = {
      email: 'test@gmail.com',
      name: 'test',
      password: '$2b$10$QTwuafopwnOX1K/XkbqwGe393FnJmeTim3gPocZ0wXPngfD/F1s0y',
      phoneNumber: '11991742156',
      roleId: 1,
    };

    expect(createSpyOn).toHaveBeenCalledWith(expectedInputCreate);
  });

  it('Should be failure when user already exists', async () => {
    const findRoleByNameSpyOn = jest.spyOn(roleRepository, 'findByName');
    const createSpyOn = jest.spyOn(userRepository, 'create');
    const encryptSpyOn = jest.spyOn(cryptographyService, 'encrypt');

    const mockFindByEmailOutput = {
      id: 17,
      name: 'test',
      email: 'test@gmail.com',
      phoneNumber: '11991742156',
      password: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'test',
      permissions: ['test'],
    };

    jest
      .spyOn(userRepository, 'findByEmail')
      .mockResolvedValue(mockFindByEmailOutput);

    await expect(useCase.run(input)).rejects.toThrow('User already exists');

    expect(createSpyOn).not.toHaveBeenCalled();
    expect(findRoleByNameSpyOn).not.toHaveBeenCalled();
    expect(encryptSpyOn).not.toHaveBeenCalled();
  });
});
