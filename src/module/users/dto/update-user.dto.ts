import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(0, 65)
  @IsOptional()
  first_name: string;

  @IsString()
  @Length(0, 65)
  @IsOptional()
  last_name: string;

  @IsString()
  @Length(0, 30)
  @IsOptional()
  area: string;

  @IsString()
  @Length(0, 100)
  @IsOptional()
  email: string;
}
