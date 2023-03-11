import { UserWatchVideo } from './../entities/user_watch_video.entity';
import { UserTakeWorkbook } from './../entities/user_take_workbook.entity';
import { UserEntity } from './../entities/user.entity';
import { CoursesOpenUsers } from './../entities/course_open_users.entity';
import { CourseEntity } from './../entities/course.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Workbook } from 'src/entities/workbook.entity';
import { WorkbookOpen } from 'src/entities/workbook_open.entity';
import { Videos } from 'src/entities/video.entity';
dotenv.config();

export const connectDb: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  password: String(process.env.DB_PASSWORD),
  username: process.env.DB_USERNAME,
  database: process.env.DATABASE,
  entities: [
    Workbook,
    CourseEntity,
    CoursesOpenUsers,
    UserEntity,
    UserTakeWorkbook,
    UserWatchVideo,
    Videos,
    WorkbookOpen,
  ],
  autoLoadEntities: true,
  synchronize: true,
};
