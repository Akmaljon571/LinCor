import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, IsOptional } from 'class-validator';
import { CreateWorkbookOpenDto } from './create-workbook_open.dto';

export class UpdateWorkbookOpenDto extends PartialType(CreateWorkbookOpenDto) {
  @ApiProperty({
    name: 'openbook_course',
    type: 'string',
    required: false,
    example: 'sdf123wfsd-sdsd-sd.d466sadasd',
  })
  @IsString()
  @IsOptional()
  courseId: string;

  @ApiProperty({
    name: 'openbook_sequence',
    type: 'string',
    required: false,
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  sequence: number;
}
