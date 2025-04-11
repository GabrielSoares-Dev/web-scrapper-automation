import { Test, TestingModule } from '@nestjs/testing';
import { CheckPermissionUseCase } from '@application/useCases/auth/checkPermission.usecase';
import { loggerMock } from '@test/helpers/mocks/logger.mock';

const input = {
  userPermissions: ['test_permission'],
  expectedPermission: 'test_permission',
};

describe('CheckAuthenticationUseCase', () => {
  let useCase: CheckPermissionUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheckPermissionUseCase, { ...loggerMock }],
    }).compile();

    useCase = module.get<CheckPermissionUseCase>(CheckPermissionUseCase);
  });

  it('Should be have permission', async () => {
    await useCase.run(input);
  });

  it('Should be no have permission', async () => {
    const input = {
      userPermissions: ['test_permission'],
      expectedPermission: 'create_permission',
    };
    await expect(useCase.run(input)).rejects.toThrow(
      'Access to this resource was denied',
    );
  });
});
