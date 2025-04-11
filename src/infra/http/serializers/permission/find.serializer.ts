import { IsNumberString } from 'class-validator';

export class FindPermissionSerializerInputDto {
  @IsNumberString()
  id: string;
}
