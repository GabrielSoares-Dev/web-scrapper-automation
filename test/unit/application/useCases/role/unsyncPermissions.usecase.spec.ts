import { Test, TestingModule } from '@nestjs/testing';
import { UnsyncPermissionsUseCase } from '@application/useCases/role/unsyncPermissions.usecase';
import {
  ROLE_REPOSITORY_TOKEN,
  RoleRepositoryInterface,
} from '@application/repositories/role.repository';
import {
  PERMISSION_REPOSITORY_TOKEN,
  PermissionRepositoryInterface,
} from '@application/repositories/permission.repository';
import { loggerMock } from '@test/helpers/mocks/logger.mock';

const mockFindRoleByNameOutput = {
  id: 1,
  name: 'test',
  description: 'test',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockFindPermissionByNameOutput = {
  id: 1,
  name: 'test',
  description: 'test',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const input = {
  role: 'test',
  permissions: ['test'],
};

describe('UnsyncPermissionsUseCase', () => {
  let useCase: UnsyncPermissionsUseCase;
  let roleRepository: RoleRepositoryInterface;
  let permissionRepository: PermissionRepositoryInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnsyncPermissionsUseCase,
        {
          provide: ROLE_REPOSITORY_TOKEN,
          useValue: {
            unsyncPermissions: jest.fn(),
            findByName: jest.fn().mockResolvedValue(mockFindRoleByNameOutput),
          },
        },
        {
          provide: PERMISSION_REPOSITORY_TOKEN,
          useValue: {
            findByName: jest
              .fn()
              .mockResolvedValue(mockFindPermissionByNameOutput),
          },
        },
        { ...loggerMock },
      ],
    }).compile();

    useCase = module.get<UnsyncPermissionsUseCase>(UnsyncPermissionsUseCase);
    roleRepository = module.get<RoleRepositoryInterface>(ROLE_REPOSITORY_TOKEN);
    permissionRepository = module.get<PermissionRepositoryInterface>(
      PERMISSION_REPOSITORY_TOKEN,
    );
  });

  it('Should be unsync permissions', async () => {
    const unsyncPermissionsSpyOn = jest.spyOn(
      roleRepository,
      'unsyncPermissions',
    );

    await useCase.run(input);

    const expectedUnsyncPermissionsInput = {
      roleId: 1,
      permissionIds: [1],
    };

    expect(unsyncPermissionsSpyOn).toHaveBeenCalledWith(
      expectedUnsyncPermissionsInput,
    );
  });

  it('Should be is invalid role', async () => {
    jest.spyOn(roleRepository, 'findByName').mockResolvedValue(null);
    const unsyncPermissionsSpyOn = jest.spyOn(
      roleRepository,
      'unsyncPermissions',
    );

    await expect(useCase.run(input)).rejects.toThrow('Invalid role');

    expect(unsyncPermissionsSpyOn).not.toHaveBeenCalled();
  });

  it('Should be some invalid permission', async () => {
    jest.spyOn(permissionRepository, 'findByName').mockResolvedValue(null);
    const unsyncPermissionsSpyOn = jest.spyOn(
      roleRepository,
      'unsyncPermissions',
    );

    await expect(useCase.run(input)).rejects.toThrow('Invalid permission');

    expect(unsyncPermissionsSpyOn).not.toHaveBeenCalled();
  });
});
