import { Test, TestingModule } from '@nestjs/testing';
import { FindRoleUseCase } from '@application/useCases/role/find.usecase';
import {
  ROLE_REPOSITORY_TOKEN,
  RoleRepositoryInterface,
} from '@application/repositories/role.repository';
import { loggerMock } from '@test/helpers/mocks/logger.mock';

const input = {
  id: 1,
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

describe('FindRoleUseCase', () => {
  let useCase: FindRoleUseCase;
  let roleRepository: RoleRepositoryInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindRoleUseCase,
        {
          provide: ROLE_REPOSITORY_TOKEN,
          useValue: {
            find: jest.fn().mockResolvedValue(mockFindOutput),
          },
        },
        { ...loggerMock },
      ],
    }).compile();

    useCase = module.get<FindRoleUseCase>(FindRoleUseCase);
    roleRepository = module.get<RoleRepositoryInterface>(ROLE_REPOSITORY_TOKEN);
  });

  it('Should be find role', async () => {
    const findSpyOn = jest.spyOn(roleRepository, 'find');
    const output = await useCase.run(input);

    const expectedOutput = {
      id: 1,
      name: 'test',
      description: 'test',
      createdAt,
      updatedAt,
    };

    expect(output).toEqual(expectedOutput);

    const expectedInputFind = 1;
    expect(findSpyOn).toHaveBeenCalledWith(expectedInputFind);
  });

  it('Should be is invalid id', async () => {
    const findSpyOn = jest
      .spyOn(roleRepository, 'find')
      .mockResolvedValue(null);

    await expect(useCase.run(input)).rejects.toThrow('Invalid id');
    const expectedInputFind = 1;
    expect(findSpyOn).toHaveBeenCalledWith(expectedInputFind);
  });
});
