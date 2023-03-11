import { PartialType, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { CreateCourseDto } from './create-course.dto';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @IsString()
  @IsOptional()
  @ApiProperty({
    name: 'title',
    type: 'string',
    default: '1-dars',
    required: true,
  })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    name: 'description',
    type: 'string',
    default: 'Bu Kurs shunday shunday narsalari bor!!!',
    required: true,
  })
  description: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    name: 'price',
    type: 'string',
    default: '1 000 000$',
    required: true,
  })
  price: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({
    name: 'sequence',
    type: 'string',
    default: '1',
    required: true,
  })
  sequence: number;
}
