import { IsString, IsOptional, IsNumberString } from 'class-validator';

export class UpdateRoleSerializerInputDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateRoleSerializerInputParamDto {
  @IsNumberString()
  id: string;
}
