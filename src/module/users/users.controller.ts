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
  Req,
  Res,
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
import { RegistrCreateDto } from './dto/registrCreate';
import { Request, Response } from 'express';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly veridfyToken: TokenMiddleware,
  ) { }

  @Post('/registr')
  @ApiBadRequestResponse()
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @HttpCode(HttpStatus.OK)
  async registr(@Body() body: RegistrUserDto) {
    return await this.usersService.registr(body);
  }

  @Get('/registr/email/:code')
  @ApiBadRequestResponse()
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiUnprocessableEntityResponse()
  @HttpCode(HttpStatus.OK)
  async registrEmail(
    @Param('code') param: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.usersService.registr_email(param, res);
  }

  @Post('/registr/create')
  @ApiBadRequestResponse()
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiUnprocessableEntityResponse()
  @HttpCode(HttpStatus.OK)
  async registrCreate(
    @Req() request: Request,
    @Body() body: RegistrCreateDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.usersService.registrCreate(request, body, res);
  }

  @Post('/login')
  @ApiBadRequestResponse()
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginUserDto) {
    return await this.usersService.login(body);
  }

  @Get('/login/email/:code')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  async loginEmail(@Param('code') params: string) {
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

  @Post('/parol/email/:code')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  async parolEmail(
    @Param('code') param: string,
    @Body() body: ParolEmailUserDto,
  ) {
    return await this.usersService.parol_email(param, body);
  }

  @Get('/statistika')
  @ApiOkResponse()
  @ApiHeader({
    name: 'autharization',
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
    name: 'autharization',
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
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
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
    name: 'autharization',
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
        return await this.usersService.updateImage(userId, bool);
      }
    }
  }

  @Patch('/update')
  @ApiNoContentResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiHeader({
    name: 'autharization',
    description: 'User token',
    required: false,
  })
  async patch(@Headers() header: any, @Body() body: PatchUserDto) {
    const userId = await this.veridfyToken.verifyUser(header);
    if (userId) {
      return await this.usersService.patch(userId, body);
    }
  }

  @Post('/update/password')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  @ApiHeader({
    name: 'autharization',
    description: 'User token',
    required: true,
  })
  async updatePassword(
    @Body() body: ParolEmailUserDto,
    @Headers() header: any,
  ) {
    const userId = await this.veridfyToken.verifyUser(header);
    if (userId) {
      return await this.usersService.updatePassword(body, userId);
    }
  }

  @Post('/update/password_email/:code')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  @ApiHeader({
    name: 'autharization',
    description: 'User token',
    required: true,
  })
  async updatePassword_email(
    @Param('code') param: string,
    @Headers() header: any,
  ) {
    const userId = await this.veridfyToken.verifyUser(header);
    if (userId) {
      return await this.usersService.updatePassword_email(param);
    }
  }

  @Put('/update/restart/:id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  @ApiHeader({
    name: 'autharization',
    description: 'Admin token',
    required: true,
  })
  async restart(
    @Param('id') param: string,
    @Headers() header: any,
  ) {
    const userId = await this.veridfyToken.verifyUser(header);
    if (userId) {
      return await this.usersService.restart(param);
    }
  }

  @Delete('/delete')
  @ApiNoContentResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiHeader({
    name: 'autharization',
    description: 'User token',
    required: false,
  })
  async delete(@Headers() header: any) {
    const userId = await this.veridfyToken.verifyUser(header);
    if (userId) {
      return await this.usersService.delete(userId);
    }
  }

  @Delete('/admin/delete/:id')
  @ApiNoContentResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiHeader({
    name: 'autharization',
    description: 'Admin token',
    required: false,
  })
  async deleteAdmin(@Headers() header: any, @Param('id') id: string) {
    const userId = await this.veridfyToken.verifyAdmin(header);
    if (userId) {
      return await this.usersService.delete(id);
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
