import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class RegistrUserDto {
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

  @IsString()
  @Length(0, 30)
  @IsNotEmpty()
  @ApiProperty({
    name: 'area',
    type: 'string',
    default: 'Toshkent',
    required: true,
  })
  area: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'password',
    type: 'string',
    default: '1a3s4ftf',
    required: true,
  })
  password: string;

  @IsString()
  @Length(0, 100)
  @IsNotEmpty()
  @ApiProperty({
    name: 'email',
    type: 'string',
    default: 'eshmatbektoshmatov@gmail.com',
    required: true,
  })
  email: string;
}
