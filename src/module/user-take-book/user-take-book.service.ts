import { Workbook } from './../../entities/workbook.entity';
import { CoursesOpenUsers } from './../../entities/course_open_users.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CourseEntity } from 'src/entities/course.entity';
import { UserEntity } from 'src/entities/user.entity';
import { HttpService } from '@nestjs/axios';
import { UserTakeWorkbook } from 'src/entities/user_take_workbook.entity';
import { Response } from 'express';

@Injectable()
export class UserTakeBookService {
  constructor(private readonly httpService: HttpService) {}

  async findOne(user_id: string, workbook_id: string, res: Response) {
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
    if (byWorkbook.utw_active) {
      const url =
        'https://storage.googleapis.com/ishladi/' + workbook.workbook_link;
      const response = await this.httpService
        .get(url, { responseType: 'arraybuffer' })
        .toPromise();

      const data = Buffer.from(response.data, 'binary');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Length', data.length);
      res.setHeader('Content-Disposition', 'attachment; filename=name.pdf');
      res.end(data);

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
