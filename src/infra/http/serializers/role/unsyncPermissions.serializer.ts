import { IsString, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';

export class UnsyncPermissionsSerializerInputDto {
  @IsNotEmpty()
  @IsString()
  role: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  permissions: string[];
}
