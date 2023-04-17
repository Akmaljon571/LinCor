import {
  Controller,
  Post,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiHeader,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TokenMiddleware } from 'src/middleware/middleware.service';
import { CoursesOpenService } from './coursesOpenUsers.service';
import { CreateCourseOpenDto } from './dto/create-course-open-users.dto';

@Controller('courses_open_users')
@ApiTags('Courses Open Users')
export class CoursesOpenController {
  constructor(
    private readonly coursesOpenService: CoursesOpenService,
    private readonly adminToken: TokenMiddleware,
  ) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    schema: {
      type: 'object',
      required: [],
      properties: {
        userId: {
          type: 'string',
          default: 'uuid',
        },
        courseId: {
          type: 'string',
          default: 'uuid',
        },
      },
    },
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiHeader({
    name: 'autharization',
    description: 'Admin token',
    required: true,
  })
  async create(
    @Body() createCourseOpenUserDto: CreateCourseOpenDto,
    @Headers() header: any,
  ) {
    const adminId = await this.adminToken.verifyAdmin(header);
    if (adminId) {
      return await this.coursesOpenService.create(createCourseOpenUserDto);
    }
  }

  @Get('/get/:id')
  @HttpCode(HttpStatus.OK)
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @ApiHeader({
    name: 'autharization',
    description: 'Admin token',
    required: true,
  })
  async get(@Param('id') id: string, @Headers() header: any) {
    const adminId = await this.adminToken.verifyAdmin(header);
    if (adminId) {
      return await this.coursesOpenService.get(id);
    }
  }

  @Delete('/delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  @ApiHeader({
    name: 'autharization',
    description: 'Admin token',
    required: true,
  })
  async deleted(@Body() body: CreateCourseOpenDto, @Headers() header: any) {
    const adminId = await this.adminToken.verifyAdmin(header);
    if (adminId) {
      return await this.coursesOpenService.deleted(body.userId, body.courseId);
    }
  }
}
