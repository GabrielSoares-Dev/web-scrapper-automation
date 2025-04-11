import { Injectable, Inject } from '@nestjs/common';
import {
  LOGGER_SERVICE_TOKEN,
  LoggerServiceInterface,
} from '@application/services/logger.service';
import {
  ROOMS_SERVICE_TOKEN,
  RoomsServiceInterface,
} from '@application/services/rooms.service';
import { SearchRoomInputDto } from '@application/dtos/useCases/rooms/search/searchRoomInput.dto';
import { SearchRoomOutputDto } from '@application/dtos/useCases/rooms/search/searchRoomOutput.dto';
import { Room } from '@domain/entities/room.entity';
import { BusinessException } from '@application/exceptions/business.exception';

@Injectable()
export class SearchRoomsUseCase {
  constructor(
    @Inject(LOGGER_SERVICE_TOKEN)
    private readonly loggerService: LoggerServiceInterface,

    @Inject(ROOMS_SERVICE_TOKEN)
    private readonly roomsService: RoomsServiceInterface,
  ) {}

  private readonly loggerContext = 'SearchRoomsUseCase';

  private validateInput(input: SearchRoomInputDto): void {
    const entity = new Room(input.checkIn, input.checkOut);

    entity.validateDates();
  }

  async run(input: SearchRoomInputDto): Promise<SearchRoomOutputDto> {
    this.loggerService.info(`START ${this.loggerContext}`);
    this.loggerService.debug('input', input);

    this.validateInput(input);

    const rooms = await this.roomsService.getRooms(input);
    this.loggerService.debug('rooms', rooms);

    const isNotFound = rooms.length === 0;

    if (isNotFound) {
      this.loggerService.debug('No rooms found');
      throw new BusinessException('No rooms found');
    }

    const output: SearchRoomOutputDto = rooms;
    this.loggerService.debug('output', output);

    this.loggerService.info(`FINISH ${this.loggerContext}`);

    return output;
  }
}
