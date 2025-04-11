import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRoleSerializerInputDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  description?: string;
}
