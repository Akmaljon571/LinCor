import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ParolEmailUserDto {
  @IsString()
  @Length(0, 100)
  @IsNotEmpty()
  @ApiProperty({
    name: 'password',
    type: 'string',
    default: '1q2w3e4r5t',
    required: true,
  })
  password: string;

  @IsString()
  @Length(0, 100)
  @IsNotEmpty()
  @ApiProperty({
    name: 'newPassword',
    type: 'string',
    default: '1q2w3e4r5t',
    required: true,
  })
  newPassword: string;

  @IsString()
  @Length(0, 10)
  @ApiProperty({
    name: 'code',
    type: 'string',
    default: '52145',
    required: true,
  })
  @IsNotEmpty()
  code: string;
}
