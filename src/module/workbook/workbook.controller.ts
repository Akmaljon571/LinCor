import { TokenMiddleware } from './../../middleware/middleware.service';
import { CreateWorkbookDto } from './dto/create-workbook.dto';
import { UseInterceptors, Get } from '@nestjs/common';
import { extname } from 'path';

import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UploadedFile,
  Headers,
  Param,
  Delete,
  Patch,
  ParseUUIDPipe,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { WorkbookService } from './workbook.service';
import { googleCloud } from 'src/utils/google-cloud';
import {
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiTags,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnprocessableEntityResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { HttpException } from '@nestjs/common/exceptions';

@Controller('workbook')
@ApiTags('Workbook')
export class WorkbookController {
  constructor(
    private readonly workbookService: WorkbookService,
    private readonly verifyToken: TokenMiddleware,
  ) {}

  @Get('/admin/:course_id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @ApiHeader({
    name: 'autharization',
    description: 'Admin Token',
    required: true,
  })
  async get(
    @Param('course_id') id: string
  ) {
    return await this.workbookService.find(id);
  }

  @Get('/by_course/:id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @ApiHeader({
    name: 'autharization',
    description: 'optional',
    required: false,
  })
  async getUser(
    @Param('id') course: string,
    @Headers() header: any
  ) {
    if (header?.autharization) {
      const userId = await this.verifyToken.verifyUser(header);
      if (userId) {
        return await this.workbookService.findAll(course, userId);
      }
    } else {
      return await this.workbookService.findAll(course, false);
    }
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @ApiHeader({ name: 'autharization', description: 'Admin Token' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'sequence', 'courseId'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        sequence: {
          type: 'number',
          default: 4,
        },
        courseId: {
          type: 'string',
          default: 'uuid',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Attendance Punch In' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() workbook: Express.Multer.File,
    @Headers() headers: any,
    @Body() body: CreateWorkbookDto,
  ) {
    if (workbook) {
      const admin = await this.verifyToken.verifyAdmin(headers);
      if (admin) {
        const workLink: any = googleCloud(workbook);
        const ext = extname(workLink);
        if (ext == '.pdf') {
          await this.workbookService.createWorkBook(body, workLink);
        } else {
          throw new HttpException(
            'The file type is not correct',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    } else {
      throw new HttpException('You have not sent a file', HttpStatus.NOT_FOUND);
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiHeader({ name: 'autharization', description: 'Admin Token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        sequence: {
          type: 'number',
          default: 4,
        },
        courseId: {
          type: 'string',
          default: 'uuid',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Attendance Punch In' })
  @UseInterceptors(FileInterceptor('workbook'))
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @ApiUnprocessableEntityResponse()
  @ApiForbiddenResponse()
  @Patch('/update/:id')
  async updateFile(
    @UploadedFile() workbook: Express.Multer.File,
    @Headers() headers: any,
    @Body() body: any,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const admin = await this.verifyToken.verifyAdmin(headers);
    if (admin) {
      if (workbook) {
        const workLink: any = googleCloud(workbook);
        const ext = extname(workLink);
        if (ext == '.pdf') {
          await this.workbookService.updateWorkBook(body, workLink, id);
        } else {
          throw new HttpException(
            'The file type is not correct',
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        await this.workbookService.updateWorkBook(body, undefined, id);
      }
    }
  }

  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiHeader({
    name: 'autharization',
    description: 'Admin token',
    required: true,
  })
  async delete(@Param('id') id: string, @Headers() header: any) {
    const admin = await this.verifyToken.verifyAdmin(header);
    if (admin) {
      await this.workbookService.deleteWorkBook(id);
    }
  }
}
