import { Test, TestingModule } from '@nestjs/testing';
import { SyncPermissionsUseCase } from '@application/useCases/role/syncPermissions.usecase';
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

describe('SyncPermissionsUseCase', () => {
  let useCase: SyncPermissionsUseCase;
  let roleRepository: RoleRepositoryInterface;
  let permissionRepository: PermissionRepositoryInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SyncPermissionsUseCase,
        {
          provide: ROLE_REPOSITORY_TOKEN,
          useValue: {
            syncPermissions: jest.fn(),
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

    useCase = module.get<SyncPermissionsUseCase>(SyncPermissionsUseCase);
    roleRepository = module.get<RoleRepositoryInterface>(ROLE_REPOSITORY_TOKEN);
    permissionRepository = module.get<PermissionRepositoryInterface>(
      PERMISSION_REPOSITORY_TOKEN,
    );
  });

  it('Should be sync permissions', async () => {
    const syncPermissionsSpyOn = jest.spyOn(roleRepository, 'syncPermissions');

    await useCase.run(input);

    const expectedSyncPermissionsInput = {
      roleId: 1,
      permissionIds: [1],
    };

    expect(syncPermissionsSpyOn).toHaveBeenCalledWith(
      expectedSyncPermissionsInput,
    );
  });

  it('Should be is invalid role', async () => {
    jest.spyOn(roleRepository, 'findByName').mockResolvedValue(null);
    const syncPermissionsSpyOn = jest.spyOn(roleRepository, 'syncPermissions');

    await expect(useCase.run(input)).rejects.toThrow('Invalid role');

    expect(syncPermissionsSpyOn).not.toHaveBeenCalled();
  });

  it('Should be some invalid permission', async () => {
    jest.spyOn(permissionRepository, 'findByName').mockResolvedValue(null);
    const syncPermissionsSpyOn = jest.spyOn(roleRepository, 'syncPermissions');

    await expect(useCase.run(input)).rejects.toThrow('Invalid permission');

    expect(syncPermissionsSpyOn).not.toHaveBeenCalled();
  });
});
