import { TokenMiddleware } from './../../middleware/middleware.service';
import { Module } from '@nestjs/common';
import { UserTakeBookService } from './user-take-book.service';
import { HttpModule } from '@nestjs/axios';
import { UserTakeBookController } from './user-take-book.controller';

@Module({
  imports: [HttpModule],
  controllers: [UserTakeBookController],
  providers: [UserTakeBookService, TokenMiddleware],
})
export class UserTakeBookModule {}
