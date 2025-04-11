import { IsNotEmpty, Matches, IsString } from 'class-validator';

export class SearchSerializerInputDto {
  @IsString()
  @IsNotEmpty({ message: 'The checkIn field is required.' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'The checkIn field must be in the format YYYY-MM-DD.',
  })
  checkIn: string;

  @IsString()
  @IsNotEmpty({ message: 'The checkOut field is required.' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'The checkOut field must be in the format YYYY-MM-DD.',
  })
  checkOut: string;
}
