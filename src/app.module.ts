import { Module } from '@nestjs/common';
import { connectDb } from './ormconfig/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { config } from './config';
import { VideoModule } from './module/video/video.module';
import { CoursesModule } from './module/courses/courses.module';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { MiddlewareModule } from './middleware/middleware.module';
import { CoursesOpenModule } from './module/coursesOpenUsers/coursesOpenUsers.module';
import { UserTakeBookModule } from './module/user-take-book/user-take-book.module';
import { UsersModule } from './module/users/users.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { WorkbookModule } from './module/workbook/workbook.module';
import { WorkbookOpenModule } from './module/workbook_open/workbook_open.module';
dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot(config),
    TypeOrmModule.forRoot(connectDb),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
    }),
    VideoModule,
    CoursesModule,
    CoursesOpenModule,
    MiddlewareModule,
    UserTakeBookModule,
    UsersModule,
    RedisModule.forRoot({
      config: {
        host: 'localhost',
        port: 6379,
        password: '',
      },
    }),
    WorkbookModule,
    WorkbookOpenModule,
  ],
})
export class AppModule {}
