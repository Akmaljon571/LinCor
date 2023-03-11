import { TokenMiddleware } from './../../middleware/middleware.service';
import { Module } from '@nestjs/common';
import { UserTakeBookService } from './user-take-book.service';
import { UserTakeBookController } from './user-take-book.controller';

@Module({
  controllers: [UserTakeBookController],
  providers: [UserTakeBookService, TokenMiddleware],
})
export class UserTakeBookModule {}
