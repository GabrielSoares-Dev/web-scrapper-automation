import { IsNumberString } from 'class-validator';

export class FindRoleSerializerInputDto {
  @IsNumberString()
  id: string;
}
