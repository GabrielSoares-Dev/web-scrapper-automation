import { Test, TestingModule } from '@nestjs/testing';
import { DeletePermissionUseCase } from '@application/useCases/permission/delete.usecase';
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

describe('DeletePermissionUseCase', () => {
  let useCase: DeletePermissionUseCase;
  let permissionRepository: PermissionRepositoryInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeletePermissionUseCase,
        {
          provide: PERMISSION_REPOSITORY_TOKEN,
          useValue: {
            find: jest.fn().mockResolvedValue(mockFindOutput),
            delete: jest.fn(),
          },
        },
        { ...loggerMock },
      ],
    }).compile();

    useCase = module.get<DeletePermissionUseCase>(DeletePermissionUseCase);
    permissionRepository = module.get<PermissionRepositoryInterface>(
      PERMISSION_REPOSITORY_TOKEN,
    );
  });

  it('Should be delete permission', async () => {
    const findSpyOn = jest.spyOn(permissionRepository, 'find');
    const deleteSpyOn = jest.spyOn(permissionRepository, 'delete');
    await useCase.run(input);

    const expectedInputFind = 1;
    expect(findSpyOn).toHaveBeenCalledWith(expectedInputFind);

    const expectedInputDelete = 1;
    expect(deleteSpyOn).toHaveBeenCalledWith(expectedInputDelete);
  });

  it('Should be is invalid id', async () => {
    const findSpyOn = jest.spyOn(permissionRepository, 'find');
    const deleteSpyOn = jest.spyOn(permissionRepository, 'delete');
    jest.spyOn(permissionRepository, 'find').mockResolvedValue(null);

    await expect(useCase.run(input)).rejects.toThrow('Invalid id');

    const expectedInputFind = 1;
    expect(findSpyOn).toHaveBeenCalledWith(expectedInputFind);
    expect(deleteSpyOn).not.toHaveBeenCalled();
  });
});
