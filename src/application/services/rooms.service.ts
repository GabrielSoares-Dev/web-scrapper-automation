import { GetRoomsServiceInputDto } from '@application/dtos/services/rooms/getRoomsInput.dto';
import { GetRoomsServiceOutputDto } from '@application/dtos/services/rooms/getRoomsOutput.dto';

export const ROOMS_SERVICE_TOKEN = 'ROOMS_SERVICE_TOKEN';

export interface RoomsServiceInterface {
  getRooms(input: GetRoomsServiceInputDto): Promise<GetRoomsServiceOutputDto>;
}
