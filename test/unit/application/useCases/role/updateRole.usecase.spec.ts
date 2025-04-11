import { Test, TestingModule } from '@nestjs/testing';
import { UpdateRoleUseCase } from '@application/useCases/role/update.usecase';
import {
  ROLE_REPOSITORY_TOKEN,
  RoleRepositoryInterface,
} from '@application/repositories/role.repository';
import { loggerMock } from '@test/helpers/mocks/logger.mock';

const input = {
  id: 1,
  name: 'test',
  description: 'test',
};
const createdAt = new Date();
const updatedAt = new Date();
const mockFindOutput = {
  id: 1,
  name: 'test',
  description: 'test',
  createdAt,
  updatedAt,
};

describe('UpdateRoleUseCase', () => {
  let useCase: UpdateRoleUseCase;
  let roleRepository: RoleRepositoryInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateRoleUseCase,
        {
          provide: ROLE_REPOSITORY_TOKEN,
          useValue: {
            find: jest.fn().mockResolvedValue(mockFindOutput),
            update: jest.fn(),
          },
        },
        { ...loggerMock },
      ],
    }).compile();

    useCase = module.get<UpdateRoleUseCase>(UpdateRoleUseCase);
    roleRepository = module.get<RoleRepositoryInterface>(ROLE_REPOSITORY_TOKEN);
  });

  it('Should be update role', async () => {
    const findSpyOn = jest.spyOn(roleRepository, 'find');
    const updateSpyOn = jest.spyOn(roleRepository, 'update');
    await useCase.run(input);

    const expectedInputFind = 1;
    expect(findSpyOn).toHaveBeenCalledWith(expectedInputFind);

    const expectedInputUpdate = {
      id: 1,
      name: 'test',
      description: 'test',
    };
    expect(updateSpyOn).toHaveBeenCalledWith(expectedInputUpdate);
  });

  it('Should be is invalid id', async () => {
    const findSpyOn = jest
      .spyOn(roleRepository, 'find')
      .mockResolvedValue(null);
    const updateSpyOn = jest.spyOn(roleRepository, 'update');

    await expect(useCase.run(input)).rejects.toThrow('Invalid id');

    const expectedInputFind = 1;
    expect(findSpyOn).toHaveBeenCalledWith(expectedInputFind);
    expect(updateSpyOn).not.toHaveBeenCalled();
  });
});
