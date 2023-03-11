import { MiddlewareModule } from './../../middleware/middleware.module';
import { TokenMiddleware } from './../../middleware/middleware.service';
import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';

@Module({
  imports: [MiddlewareModule],
  controllers: [CoursesController],
  providers: [CoursesService, TokenMiddleware],
})
export class CoursesModule {}
