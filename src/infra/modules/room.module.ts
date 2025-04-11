import { Module } from '@nestjs/common';
import { RoomController } from '@infra/http/controllers/room.controller';
import { SearchRoomsUseCase } from '@application/useCases/rooms/searchRooms.usecase';
import { ROOMS_SERVICE_TOKEN } from '@application/services/rooms.service';
import { RoomsService } from '@infra/services/rooms.service';

@Module({
  controllers: [RoomController],
  providers: [
    SearchRoomsUseCase,
    {
      provide: ROOMS_SERVICE_TOKEN,
      useClass: RoomsService,
    },
  ],
  exports: [ROOMS_SERVICE_TOKEN],
})
export class RoomModule {}
