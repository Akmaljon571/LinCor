import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateWorkbookDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  sequence: number;

  @IsString()
  @IsNotEmpty()
  courseId: string;
}
