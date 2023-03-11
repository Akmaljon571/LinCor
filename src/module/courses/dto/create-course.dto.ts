import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'title',
    type: 'string',
    default: '1-dars',
    required: true,
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'description',
    type: 'string',
    default: 'Bu Kurs shunday shunday narsalari bor!!!',
    required: true,
  })
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'price',
    type: 'string',
    default: '1 000 000$',
    required: true,
  })
  price: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({
    name: 'sequence',
    type: 'string',
    default: '1',
    required: true,
  })
  sequence: number;
}
