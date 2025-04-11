import { IsString, IsOptional, IsNumberString } from 'class-validator';

export class UpdatePermissionSerializerInputDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdatePermissionSerializerInputParamDto {
  @IsNumberString()
  id: string;
}
