import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateWorkbookDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  sequence: number;

  @IsString()
  @IsOptional()
  courseId: string;
}
