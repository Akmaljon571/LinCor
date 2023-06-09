import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Headers,
  UploadedFile,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  HttpException,
  Res,
  Delete,
} from '@nestjs/common';
import { WorkbookOpenService } from './workbook_open.service';
import { CreateWorkbookOpenDto } from './dto/create-workbook_open.dto';
import { UpdateWorkbookOpenDto } from './dto/update-workbook_open.dto';
import { TokenMiddleware } from 'src/middleware/middleware.service';
import { googleCloud } from 'src/utils/google-cloud';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { extname } from 'path';
import { Response } from 'express';

@Controller('workbookopen')
@ApiTags('Workbook Open')
export class WorkbookOpenController {
  constructor(
    private readonly workbookopenService: WorkbookOpenService,
    private readonly veridfyToken: TokenMiddleware,
  ) {}

  @Get('/get/:course_id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async get(@Param('course_id') id: string) {
    return await this.workbookopenService.get(id);
  }

  @Get('/one/:id')
  async one(@Param('id') id: string, @Res() res: Response) {
    return await this.workbookopenService.one(id, res);
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @ApiHeader({ name: 'autharization', description: 'Admin token' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'courseId', 'sequence'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        sequence: {
          type: 'number',
          default: 1,
        },
        courseId: {
          type: 'string',
          default: 'cc7b599a-5d67-45eb-9205-077dbe81b7bf',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Attendance Punch In' })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiHeader({
    name: 'autharization',
    description: 'Admin Token',
    required: true,
  })
  @ApiUnprocessableEntityResponse()
  @ApiForbiddenResponse()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() body: CreateWorkbookOpenDto,
    @Headers() headers: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (await this.veridfyToken.verifyAdmin(headers)) {
      const workbookopen_link: any = googleCloud(file);
      const ext = extname(workbookopen_link);
      if (ext === '.pdf') {
        await this.workbookopenService.create(body, workbookopen_link);
      } else {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }
    }
  }

  @Patch('/update/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiCreatedResponse()
  @ApiUnprocessableEntityResponse()
  @ApiForbiddenResponse()
  @ApiOperation({ summary: 'Attendance Punch In' })
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
          default: 1,
        },
        courseId: {
          type: 'string',
          default: 'cc7b599a-5d67-45eb-9205-077dbe81b7bf',
        },
      },
    },
  })
  @ApiHeader({ name: 'autharization', description: 'Admin token' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('workbookopen'))
  async update(
    @Param('id') id: string,
    @Body() body: UpdateWorkbookOpenDto,
    @Headers() headers: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (await this.veridfyToken.verifyAdmin(headers)) {
      if (file) {
        const workbookopen_link: any = googleCloud(file);
        const ext = extname(workbookopen_link);
        if (ext === '.pdf') {
          await this.workbookopenService.update(body, workbookopen_link, id);
        } else {
          throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
        }
      } else {
        await this.workbookopenService.update(body, false, id);
      }
    }
  }

  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiCreatedResponse()
  @ApiUnprocessableEntityResponse()
  @ApiForbiddenResponse()
  @ApiHeader({ name: 'autharization', description: 'Admin token' })
  async delete(@Param('id') id: string, @Headers() headers: any) {
    if (await this.veridfyToken.verifyAdmin(headers)) {
      await this.workbookopenService.delete(id);
    }
  }
}
