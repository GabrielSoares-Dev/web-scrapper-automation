import { Test, TestingModule } from '@nestjs/testing';
import { CreateRoleUseCase } from '@application/useCases/role/create.usecase';
import {
  ROLE_REPOSITORY_TOKEN,
  RoleRepositoryInterface,
} from '@application/repositories/role.repository';
import { loggerMock } from '@test/helpers/mocks/logger.mock';

const input = {
  name: 'test',
  description: 'test',
};

describe('CreateRoleUseCase', () => {
  let useCase: CreateRoleUseCase;
  let roleRepository: RoleRepositoryInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateRoleUseCase,
        {
          provide: ROLE_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            findByName: jest.fn().mockResolvedValue(null),
          },
        },
        { ...loggerMock },
      ],
    }).compile();

    useCase = module.get<CreateRoleUseCase>(CreateRoleUseCase);
    roleRepository = module.get<RoleRepositoryInterface>(ROLE_REPOSITORY_TOKEN);
  });

  it('Should be create role', async () => {
    const findByNameSpyOn = jest.spyOn(roleRepository, 'findByName');

    const createSpyOn = jest.spyOn(roleRepository, 'create');

    await useCase.run(input);

    expect(findByNameSpyOn).toHaveBeenCalledWith('test');

    const expectedInputCreate = {
      name: 'test',
      description: 'test',
    };
    expect(createSpyOn).toHaveBeenCalledWith(expectedInputCreate);
  });

  it('Should be failure when role already exists', async () => {
    const mockFindByNameOutput = {
      id: 1,
      name: 'test',
      description: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const findByNameSpyOn = jest
      .spyOn(roleRepository, 'findByName')
      .mockResolvedValue(mockFindByNameOutput);
    const createSpyOn = jest.spyOn(roleRepository, 'create');

    await expect(useCase.run(input)).rejects.toThrow('Role already exists');

    expect(findByNameSpyOn).toHaveBeenCalledWith('test');
    expect(createSpyOn).not.toHaveBeenCalled();
  });
});
