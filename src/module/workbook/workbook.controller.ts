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
    private readonly adminToken: TokenMiddleware,
  ) {}

  @Get('/admin')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @ApiHeader({
    name: 'admin_token',
    description: 'Admin Token',
    required: true,
  })
  async findAll(@Headers() header: any) {
    const userId = await this.adminToken.verifyAdmin(header);
    if (userId) {
      return await this.workbookService.findAll();
    }
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @ApiHeader({ name: 'admin_token', description: 'Admin Token' })
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
      const admin = await this.adminToken.verifyAdmin(headers);
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
  @ApiHeader({ name: 'admin_token', description: 'Admin Token' })
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
    const admin = await this.adminToken.verifyAdmin(headers);
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
    name: 'admin_token',
    description: 'Admin token',
    required: true,
  })
  async delete(@Param('id') id: string, @Headers() header: any) {
    const admin = await this.adminToken.verifyAdmin(header);
    if (admin) {
      await this.workbookService.deleteWorkBook(id);
    }
  }
}
