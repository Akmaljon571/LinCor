import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateWorkbookOpenDto {
  @ApiProperty({
    name: 'openbook_course',
    type: 'string',
    required: true,
    example: 'sdf123wfsd-sdsd-sd.d466sadasd',
  })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({
    name: 'openbook_sequence',
    type: 'string',
    required: true,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  sequence: number;
}
