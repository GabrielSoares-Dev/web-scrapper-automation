import {
  Controller,
  Post,
  Inject,
  Res,
  HttpException,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import {
  LOGGER_SERVICE_TOKEN,
  LoggerServiceInterface,
} from '@application/services/logger.service';
import { SearchRoomsUseCase } from '@application/useCases/rooms/searchRooms.usecase';
import { Response } from 'express';
import { SearchSerializerInputDto } from '../serializers/room/searchInput.serializer';

@Controller({ path: 'room', version: '1' })
export class RoomController {
  constructor(
    @Inject(LOGGER_SERVICE_TOKEN)
    private readonly loggerService: LoggerServiceInterface,
    private readonly searchRoomsUseCase: SearchRoomsUseCase,
  ) {}

  private readonly context = 'RoomController';

  @Post('search')
  @HttpCode(HttpStatus.OK)
  async search(@Body() input: SearchSerializerInputDto, @Res() res: Response) {
    this.loggerService.info(`START ${this.context} search`);
    this.loggerService.debug('input', input);
    try {
      const output = await this.searchRoomsUseCase.run(input);
      this.loggerService.info(`FINISH ${this.context} search`);

      const response = {
        statusCode: HttpStatus.OK,
        message: 'Found rooms',
        content: output,
      };
      return res.json(response);
    } catch (error) {
      const errorMessage = error.message;
      let httpCode = HttpStatus.INTERNAL_SERVER_ERROR;

      const noFoundRooms = errorMessage === 'No rooms found';

      if (noFoundRooms) httpCode = HttpStatus.NOT_FOUND;

      this.loggerService.error('error', errorMessage);
      throw new HttpException(errorMessage, httpCode);
    }
  }
}
