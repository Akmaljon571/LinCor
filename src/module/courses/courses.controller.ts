import { FileInterceptor } from '@nestjs/platform-express';
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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TokenMiddleware } from 'src/middleware/middleware.service';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { googleCloud } from 'src/utils/google-cloud';

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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Attendance Punch In' })
  @ApiHeader({
    name: 'autharization',
    description: 'Admin token',
    required: true,
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'file',
        'title',
        'description',
        'price',
        'sequence',
        'bgcolor',
      ],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        title: {
          type: 'string',
          default: '3-dars',
        },
        description: {
          type: 'string',
          default: 'Bugungi dars paloncha',
        },
        price: {
          type: 'string',
          default: '3 000 000',
        },
        bgcolor: {
          type: 'string',
          default: 'black',
        },
        sequence: {
          type: 'number',
          default: 4,
        },
      },
    },
  })
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @Headers() header: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (await this.veridfyToken.verifyAdmin(header)) {
      const bool: any = googleCloud(file);
      if (bool) {
        await this.coursesService.create(createCourseDto, bool);
      }
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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Attendance Punch In' })
  @ApiHeader({
    name: 'autharization',
    description: 'Admin token',
    required: true,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        title: {
          type: 'string',
          default: '3-dars',
        },
        description: {
          type: 'string',
          default: 'Bugungi dars paloncha',
        },
        price: {
          type: 'string',
          default: '3 000 000',
        },
        bgcolor: {
          type: 'string',
          default: 'black',
        },
        sequence: {
          type: 'number',
          default: 4,
        },
      },
    },
  })
  @ApiHeader({
    name: 'autharization',
    description: 'Admin token',
    required: true,
  })
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Headers() headers: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (await this.veridfyToken.verifyAdmin(headers)) {
      const bool: any = googleCloud(file);
      if (bool) {
        await this.coursesService.update(updateCourseDto, id, bool);
      }
    }
  }

  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  @ApiHeader({
    name: 'autharization',
    description: 'Admin token',
    required: true,
  })
  async remove(@Param('id') id: string, @Headers() headers: any) {
    if (await this.veridfyToken.verifyAdmin(headers)) {
      await this.coursesService.remove(id);
    }
  }
}
