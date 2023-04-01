import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateVideoDto {
  @IsString()
  @Length(0, 100)
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  sequence: number;

  @IsString()
  @IsOptional()
  duration: string;

  @IsString()
  @IsOptional()
  course_id: string;
}
