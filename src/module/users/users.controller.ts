import { FileInterceptor } from '@nestjs/platform-express';
import { ParolEmailUserDto } from './dto/parol_email';
import { RegistrUserDto } from './dto/registr';
import { UsersService } from './users.service';
import { LoginUserDto } from './dto/login';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  HttpStatus,
  Param,
  Get,
  Headers,
  UseInterceptors,
  UploadedFile,
  Put,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ParolUserDto } from './dto/parol';
import { TokenMiddleware } from 'src/middleware/middleware.service';
import { googleCloud } from 'src/utils/google-cloud';
import { PatchUserDto } from './dto/patch.all';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly veridfyToken: TokenMiddleware,
  ) {}

  @Post('/registr')
  @ApiBadRequestResponse()
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @HttpCode(HttpStatus.OK)
  async registr(@Body() body: RegistrUserDto) {
    return await this.usersService.registr(body);
  }

  @Post('/login')
  @ApiBadRequestResponse()
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginUserDto) {
    return await this.usersService.login(body);
  }

  @Get('/registr/email/:id')
  @ApiBadRequestResponse()
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiUnprocessableEntityResponse()
  @HttpCode(HttpStatus.OK)
  async registrEmail(@Param('id') param: string) {
    return await this.usersService.registr_email(param);
  }

  @Get('/login/email/:id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  async loginEmail(@Param('id') params: string) {
    return await this.usersService.login_email(params);
  }

  @Post('/parol')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  async parol(@Body() body: ParolUserDto) {
    return await this.usersService.parol(body);
  }

  @Post('/parol/email/:id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  async parolEmail(
    @Param('id') param: string,
    @Body() body: ParolEmailUserDto,
  ) {
    return await this.usersService.parol_email(param, body);
  }

  @Get('/statistika')
  @ApiOkResponse()
  @ApiHeader({
    name: 'admin_token',
    description: 'Admin token',
    required: false,
  })
  @HttpCode(HttpStatus.OK)
  async statistika(@Headers() header: any) {
    const adminId = await this.veridfyToken.verifyAdmin(header);
    if (adminId) {
      return await this.usersService.statistika();
    }
  }

  @Get('/')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  @ApiHeader({
    name: 'user_token',
    description: 'User token',
    required: false,
  })
  async get(@Headers() header: any) {
    const userId = await this.veridfyToken.verifyUser(header);
    if (userId) {
      return await this.usersService.get(userId);
    }
  }

  @Put('/update_img')
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
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Attendance Punch In' })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiHeader({
    name: 'user_token',
    description: 'User token',
    required: false,
  })
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Headers() header: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = await this.veridfyToken.verifyUser(header);
    if (userId) {
      const bool: any = googleCloud(file);
      if (bool) {
        await this.usersService.updateImage(userId, bool);
      }
    }
  }

  @Patch('/update')
  @ApiNoContentResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiHeader({
    name: 'user_token',
    description: 'User token',
    required: false,
  })
  async patch(@Headers() header: any, @Body() body: PatchUserDto) {
    const userId = await this.veridfyToken.verifyUser(header);
    if (userId) {
      return await this.usersService.patch(userId, body);
    }
  }

  @Delete('/delete')
  @ApiNoContentResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiHeader({
    name: 'user_token',
    description: 'User token',
    required: false,
  })
  async delete(@Headers() header: any) {
    const userId = await this.veridfyToken.verifyUser(header);
    if (userId) {
      return await this.usersService.delete(userId);
    }
  }

  @Post('/admin/login')
  @ApiBadRequestResponse()
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body() body: LoginUserDto) {
    return await this.usersService.admin_login(body);
  }

  @Get('/admin/login/email/:id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  async adminLoginEmail(@Param('id') params: string) {
    return await this.usersService.admin_login_email(params);
  }
}
