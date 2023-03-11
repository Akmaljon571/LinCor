import { Module } from '@nestjs/common';
import { CoursesOpenService } from './coursesOpenUsers.service';
import { CoursesOpenController } from './coursesOpenUsers.controller';
import { TokenMiddleware } from 'src/middleware/middleware.service';

@Module({
  controllers: [CoursesOpenController],
  providers: [CoursesOpenService, TokenMiddleware],
})
export class CoursesOpenModule {}
