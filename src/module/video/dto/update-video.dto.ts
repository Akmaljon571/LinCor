import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateVideoDto {
  @IsString()
  @Length(0, 100)
  @IsNotEmpty()
  @IsOptional()
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @IsOptional()
  sequence: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  duration: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  course_id: string;
}
