import { IsNumberString } from 'class-validator';

export class DeleteRoleSerializerInputDto {
  @IsNumberString()
  id: string;
}
