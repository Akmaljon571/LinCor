import { Workbook } from './../../entities/workbook.entity';
import { CoursesOpenUsers } from './../../entities/course_open_users.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CourseEntity } from 'src/entities/course.entity';
import { UserEntity } from 'src/entities/user.entity';
import { UserTakeWorkbook } from 'src/entities/user_take_workbook.entity';

@Injectable()
export class UserTakeBookService {
  async findOne(user_id: string, workbook_id: string) {
    const workbook: any = await Workbook.findOne({
      relations: {
        workbook_course: true,
      },
      where: {
        workbook_id,
      },
    }).catch(() => {
      throw new HttpException('Workbook Not Found', HttpStatus.NOT_FOUND);
    });
    if (!workbook) {
      throw new HttpException('Workbook Not Found', HttpStatus.NOT_FOUND);
    }

    const Course: any = await CourseEntity.findOne({
      where: {
        course_id: workbook.workbook_course.course_id,
      },
    }).catch(() => {
      throw new HttpException('Course Not Found', HttpStatus.NOT_FOUND);
    });
    if (!Course) {
      throw new HttpException('Course Not Found', HttpStatus.NOT_FOUND);
    }

    const User: any = await UserEntity.findOne({
      where: {
        user_id,
      },
    }).catch(() => {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    });
    if (!User) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    const course_open_user = await CoursesOpenUsers.findOne({
      where: {
        course_id: Course.course_id,
        user_id: User.user_id,
      },
    }).catch(() => {
      throw new HttpException(
        'Course has not been purchased',
        HttpStatus.NOT_FOUND,
      );
    });
    if (!course_open_user) {
      throw new HttpException(
        'Course has not been purchased',
        HttpStatus.NOT_FOUND,
      );
    }
    const byWorkbook = await UserTakeWorkbook.findOne({
      where: {
        workbook_id: workbook.workbook_id,
        user_id: User.user_id,
      },
    }).catch(() => {
      throw new HttpException(
        'User Take Workbook Not Found',
        HttpStatus.NOT_FOUND,
      );
    });
    if (!byWorkbook) {
      throw new HttpException(
        'User Take Workbook Not Found',
        HttpStatus.NOT_FOUND,
      );
    }
    console.log(byWorkbook);
    if (byWorkbook.utw_active) {
      //

      await UserTakeWorkbook.createQueryBuilder()
        .update()
        .set({
          utw_active: false,
        })
        .where({
          workbook_id: workbook.workbook_id,
        })
        .execute();
    } else {
      throw new HttpException(
        'Book was previously loaded',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
