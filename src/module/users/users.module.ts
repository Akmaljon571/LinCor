import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TokenMiddleware } from 'src/middleware/middleware.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, TokenMiddleware],
})
export class UsersModule {}
