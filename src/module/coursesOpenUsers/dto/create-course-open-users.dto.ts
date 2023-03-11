import { IsNotEmpty, IsString } from "class-validator"

export class CreateCourseOpenDto {
    @IsNotEmpty()
    @IsString()
    userId : string

    @IsNotEmpty()
    @IsString()
    courseId : string

}
