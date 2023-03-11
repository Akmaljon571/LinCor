import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TokenMiddleware } from 'src/middleware/middleware.service';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
@ApiTags('Course')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly veridfyToken: TokenMiddleware,
  ) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiCreatedResponse()
  @ApiHeader({
    name: 'admin_token',
    description: 'Admin token',
    required: true,
  })
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @Headers() header: any,
  ) {
    if (await this.veridfyToken.verifyAdmin(header)) {
      await this.coursesService.create(createCourseDto);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findAll() {
    return await this.coursesService.findAll();
  }

  @Patch('/update/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  @ApiHeader({
    name: 'admin_token',
    description: 'Admin token',
    required: true,
  })
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Headers() headers: any,
  ) {
    if (await this.veridfyToken.verifyAdmin(headers)) {
      await this.coursesService.update(updateCourseDto, id);
    }
  }

  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  @ApiHeader({
    name: 'admin_token',
    description: 'Admin token',
    required: true,
  })
  async remove(@Param('id') id: string, @Headers() headers: any) {
    if (await this.veridfyToken.verifyAdmin(headers)) {
      await this.coursesService.remove(id);
    }
  }
}
