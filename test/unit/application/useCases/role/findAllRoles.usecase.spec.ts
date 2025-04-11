import { Test, TestingModule } from '@nestjs/testing';
import { FindAllRolesUseCase } from '@application/useCases/role/findAll.usecase';
import { ROLE_REPOSITORY_TOKEN } from '@application/repositories/role.repository';
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
describe('FindAllRolesUseCase', () => {
  let useCase: FindAllRolesUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllRolesUseCase,
        {
          provide: ROLE_REPOSITORY_TOKEN,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockFindAllOutput),
          },
        },
        { ...loggerMock },
      ],
    }).compile();

    useCase = module.get<FindAllRolesUseCase>(FindAllRolesUseCase);
  });

  it('Should be find all roles', async () => {
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
