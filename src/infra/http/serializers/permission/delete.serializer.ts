import { IsNumberString } from 'class-validator';

export class DeletePermissionSerializerInputDto {
  @IsNumberString()
  id: string;
}
