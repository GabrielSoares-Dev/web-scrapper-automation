import { Test, TestingModule } from '@nestjs/testing';
import { FindPermissionUseCase } from '@application/useCases/permission/find.usecase';
import {
  PERMISSION_REPOSITORY_TOKEN,
  PermissionRepositoryInterface,
} from '@application/repositories/permission.repository';
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

describe('FindPermissionUseCase', () => {
  let useCase: FindPermissionUseCase;
  let permissionRepository: PermissionRepositoryInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindPermissionUseCase,
        {
          provide: PERMISSION_REPOSITORY_TOKEN,
          useValue: {
            find: jest.fn().mockResolvedValue(mockFindOutput),
          },
        },
        { ...loggerMock },
      ],
    }).compile();

    useCase = module.get<FindPermissionUseCase>(FindPermissionUseCase);
    permissionRepository = module.get<PermissionRepositoryInterface>(
      PERMISSION_REPOSITORY_TOKEN,
    );
  });

  it('Should be find permission', async () => {
    const findSpyOn = jest.spyOn(permissionRepository, 'find');
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
      .spyOn(permissionRepository, 'find')
      .mockResolvedValue(null);

    await expect(useCase.run(input)).rejects.toThrow('Invalid id');

    const expectedInputFind = 1;
    expect(findSpyOn).toHaveBeenCalledWith(expectedInputFind);
  });
});
