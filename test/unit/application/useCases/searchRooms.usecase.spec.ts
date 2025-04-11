import { Test, TestingModule } from '@nestjs/testing';
import { SearchRoomsUseCase } from '@application/useCases/rooms/searchRooms.usecase';
import { loggerMock } from '@test/helpers/mocks/logger.mock';
import {
  ROOMS_SERVICE_TOKEN,
  RoomsServiceInterface,
} from '@application/services/rooms.service';

const input = {
  checkIn: '2025-07-01',
  checkOut: '2025-07-03',
};

const getRoomsMockOutput = [
  {
    name: 'test-name-1',
    description: 'test-description-1',
    price: 'R$ 750',
    image: 'test-image-1',
  },
  {
    name: 'test-name-2',
    description: 'test-description-2',
    price: 'R$ 300',
    image: 'test-image-2',
  },
];

describe('SearchRoomsUseCase', () => {
  let useCase: SearchRoomsUseCase;
  let roomsService: RoomsServiceInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchRoomsUseCase,
        {
          provide: ROOMS_SERVICE_TOKEN,
          useValue: {
            getRooms: jest.fn().mockResolvedValue(getRoomsMockOutput),
          },
        },
        { ...loggerMock },
      ],
    }).compile();

    useCase = module.get<SearchRoomsUseCase>(SearchRoomsUseCase);
    roomsService = module.get<RoomsServiceInterface>(ROOMS_SERVICE_TOKEN);
  });

  it('Should be search rooms succesfully', async () => {
    const getRoomsSpyon = jest.spyOn(roomsService, 'getRooms');
    const output = await useCase.run(input);

    const expectedOutput = [
      {
        name: 'test-name-1',
        description: 'test-description-1',
        price: 'R$ 750',
        image: 'test-image-1',
      },
      {
        name: 'test-name-2',
        description: 'test-description-2',
        price: 'R$ 300',
        image: 'test-image-2',
      },
    ];
    expect(output).toEqual(expectedOutput);

    const expectedGetRoomsInput = {
      checkIn: input.checkIn,
      checkOut: input.checkOut,
    };
    expect(getRoomsSpyon).toHaveBeenCalledWith(expectedGetRoomsInput);
  });

  it('Should be roms not found', async () => {
    const getRoomsSpyon = jest
      .spyOn(roomsService, 'getRooms')
      .mockResolvedValue([]);

    await expect(useCase.run(input)).rejects.toThrow('No rooms found');

    const expectedGetRoomsInput = {
      checkIn: input.checkIn,
      checkOut: input.checkOut,
    };
    expect(getRoomsSpyon).toHaveBeenCalledWith(expectedGetRoomsInput);
  });
});
