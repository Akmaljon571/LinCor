import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CourseEntity } from 'src/entities/course.entity';
import { CoursesOpenUsers } from 'src/entities/course_open_users.entity';
import { UserEntity } from 'src/entities/user.entity';
import { UserTakeWorkbook } from 'src/entities/user_take_workbook.entity';
import { Workbook } from 'src/entities/workbook.entity';
import { CreateCourseOpenDto } from './dto/create-course-open-users.dto';

@Injectable()
export class CoursesOpenService {
  async create(createCourseopenUser: CreateCourseOpenDto) {
    const user: any = await UserEntity.findOne({
      where: {
        user_id: createCourseopenUser.userId,
      },
    }).catch(() => {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    });

    if (!user) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const course: any = await CourseEntity.findOne({
      where: {
        course_id: createCourseopenUser.courseId,
      },
    }).catch(() => {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    });
    if (!course) {
      return new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }

    const userbyCourse = await CoursesOpenUsers.findOne({
      where: {
        course_id: course.course_id,
        user_id: user.user_id,
      },
    });
    if (userbyCourse) {
      throw new HttpException('User alredy buy course', HttpStatus.BAD_REQUEST);
    }

    const workbook: Workbook[] = await Workbook.find({
      where: {
        workbook_course: {
          course_id: course.course_id,
        },
      },
      relations: {
        workbook_course: true,
      },
      select: {
        workbook_course: {
          course_id: true,
        },
      },
    }).catch(() => {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    });
    const CoursesOpenUser = await CoursesOpenUsers.createQueryBuilder()
      .insert()
      .into(CoursesOpenUsers)
      .values({
        user_id: user,
        course_id: course,
      })
      .returning('*')
      .execute()
      .catch(() => {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      });

    workbook.map(async (e) => {
      await UserTakeWorkbook.createQueryBuilder()
        .insert()
        .into(UserTakeWorkbook)
        .values({
          utw_connection: CoursesOpenUser.raw[0].created_at,
          utw_active: true,
          workbook_id: e.workbook_id as any,
          user_id: user.user_id,
        })
        .execute()
        .catch(() => {
          throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
        });
    });

    return 'The user has purchased a course';
  }
}
