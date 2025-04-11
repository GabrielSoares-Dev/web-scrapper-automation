import { Test, TestingModule } from '@nestjs/testing';
import { FindAllPermissionsUseCase } from '@application/useCases/permission/findAll.usecase';
import { PERMISSION_REPOSITORY_TOKEN } from '@application/repositories/permission.repository';
import { loggerMock } from '@test/helpers/mocks/logger.mock';

const createdAt = new Date();
const updatedAt = new Date();
const mockFindAllOutput = [
  {
    id: 1,
    name: 'test',
    description: 'test',
    createdAt,
    updatedAt,
  },
];
describe('FindAllPermissionsUseCase', () => {
  let useCase: FindAllPermissionsUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllPermissionsUseCase,
        {
          provide: PERMISSION_REPOSITORY_TOKEN,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockFindAllOutput),
          },
        },
        { ...loggerMock },
      ],
    }).compile();

    useCase = module.get<FindAllPermissionsUseCase>(FindAllPermissionsUseCase);
  });

  it('Should be find all permissions', async () => {
    const output = await useCase.run();

    const expectedOutput = [
      {
        id: 1,
        name: 'test',
        description: 'test',
        createdAt,
        updatedAt,
      },
    ];

    expect(output).toEqual(expectedOutput);
  });
});
