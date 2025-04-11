import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from '@infra/services/rooms.service';
import {
  LOGGER_SERVICE_TOKEN,
  LoggerServiceInterface,
} from '@application/services/logger.service';
import puppeteer from 'puppeteer-core';

jest.mock('puppeteer-core');

describe('RoomsService', () => {
  let service: RoomsService;
  let loggerService: LoggerServiceInterface;

  const mockLoggerService = {
    error: jest.fn(),
  };

  const mockBrowser = {
    newPage: jest.fn(),
    close: jest.fn(),
  };

  const mockPage = {
    goto: jest.fn(),
    evaluate: jest.fn(),
    close: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        {
          provide: LOGGER_SERVICE_TOKEN,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
    loggerService = module.get<LoggerServiceInterface>(LOGGER_SERVICE_TOKEN);

    (puppeteer.connect as jest.Mock).mockResolvedValue(mockBrowser);
    mockBrowser.newPage.mockResolvedValue(mockPage);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be fetch rooms successfully', async () => {
    const mockInput = {
      checkIn: '2025-07-01',
      checkOut: '2025-07-03',
    };

    const mockRooms = [
      {
        name: 'test-name-1',
        description: 'test-description-1',
        price: 'R$ 100',
        image: 'test-image-1',
      },
      {
        name: 'test-name-2',
        description: 'test-description-2',
        price: 'R$ 200',
        image: 'test-image-2',
      },
    ];

    mockPage.goto.mockResolvedValue(undefined);
    mockPage.evaluate.mockResolvedValue(mockRooms);

    const output = await service.getRooms(mockInput);

    const expectedOutput = mockRooms;
    expect(output).toEqual(expectedOutput);
    expect(mockPage.goto).toHaveBeenCalledWith(
      `${process.env.DATA_SOURCE_URL}?entrada=${mockInput.checkIn}&saida=${mockInput.checkOut}&adultos=1#acomodacoes`,
      { waitUntil: 'networkidle0', timeout: 0 },
    );
    expect(mockPage.evaluate).toHaveBeenCalled();
    expect(mockBrowser.close).toHaveBeenCalled();
  });

  it('Should log an error and throw if fetching rooms fails', async () => {
    const mockInput = {
      checkIn: '2025-07-01',
      checkOut: '2025-07-03',
    };

    const mockError = new Error('Test error');
    mockPage.goto.mockRejectedValue(mockError);

    await expect(service.getRooms(mockInput)).rejects.toThrow(
      'Failed to fetch room data.',
    );
    expect(loggerService.error).toHaveBeenCalledWith(
      'Error fetching rooms data:',
      mockError,
    );
    expect(mockBrowser.close).toHaveBeenCalled();
  });
});
