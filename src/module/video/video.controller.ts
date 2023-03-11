import { UpdateVideoDto } from './dto/update-video.dto';
import { TokenMiddleware } from './../../middleware/middleware.service';
import { CreateVideoDto } from './dto/create-video.dto';
import {
  Controller,
  Post,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  UploadedFile,
  Body,
  Get,
  Param,
  Headers,
  Patch,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideoService } from './video.service';
import { googleCloud } from 'src/utils/google-cloud';
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

@Controller('video')
@ApiTags('Video')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly veridfyToken: TokenMiddleware,
  ) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'file',
        'title',
        'description',
        'duration',
        'sequence',
        'course_id',
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
        duration: {
          type: 'string',
          default: '30:00',
        },
        sequence: {
          type: 'number',
          default: 4,
        },
        course_id: {
          type: 'string',
          default: 'uuid',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Attendance Punch In' })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiCreatedResponse()
  @ApiHeader({
    name: 'admin_token',
    description: 'Admin token',
    required: true,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateVideoDto,
    @Headers() header: any,
  ) {
    if (await this.veridfyToken.verifyAdmin(header)) {
      const bool = googleCloud(file);
      if (bool) {
        await this.videoService.create(body, bool);
      }
    }
  }

  @Get('/by_course/:id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @ApiHeader({ name: 'user_token', description: 'optional', required: false })
  async findAll(@Param('id') course: string, @Headers() header: any) {
    if (header?.user_token) {
      const userId = await this.veridfyToken.verifyUser(header);
      if (userId) {
        return await this.videoService.findAll(course, userId);
      }
    } else {
      return await this.videoService.findAll(course, false);
    }
  }

  @Get(':id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @ApiHeader({ name: 'user_token', description: 'optional', required: false })
  async findOne(@Param('id') id: string, @Headers() header: any) {
    if (header?.user_token) {
      const userId = await this.veridfyToken.verifyUser(header);
      if (userId) {
        return await this.videoService.findOne(id, userId);
      }
    } else {
      return await this.videoService.findOne(id, false);
    }
  }

  @Patch('/update/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
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
        duration: {
          type: 'string',
          default: '30:00',
        },
        sequence: {
          type: 'number',
          default: 4,
        },
        course_id: {
          type: 'string',
          default: 'uuid',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Attendance Punch In' })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiHeader({
    name: 'admin_token',
    description: 'Admin token',
    required: false,
  })
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Headers() header: any,
    @Body() body: UpdateVideoDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const adminId = await this.veridfyToken.verifyAdmin(header);
    if (adminId) {
      if (file) {
        const bool = googleCloud(file);
        if (bool) {
          await this.videoService.update(id, body, bool);
        }
      } else {
        await this.videoService.update(id, body, false);
      }
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
  async delete(@Param('id') id: string, @Headers() header: any) {
    const adminId = await this.veridfyToken.verifyAdmin(header);
    if (adminId) {
      await this.videoService.delete(id);
    }
  }
}
