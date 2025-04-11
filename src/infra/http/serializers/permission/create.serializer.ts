import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePermissionSerializerInputDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  description?: string;
}
