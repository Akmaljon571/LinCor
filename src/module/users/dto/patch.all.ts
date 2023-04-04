import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class PatchUserDto {
  @IsString()
  @ApiProperty({
    name: 'first_name',
    type: 'string',
    default: 'Eshmat',
    required: true,
  })
  @Length(0, 65)
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @Length(0, 65)
  @ApiProperty({
    name: 'last_name',
    type: 'string',
    default: 'Toshmatov',
    required: true,
  })
  @IsNotEmpty()
  last_name: string;
}
