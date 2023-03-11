import { HttpException } from '@nestjs/common/exceptions';
import { Injectable, HttpStatus } from '@nestjs/common';
import { CourseEntity } from 'src/entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  async create(body: CreateCourseDto) {
    await CourseEntity.createQueryBuilder()
      .insert()
      .into(CourseEntity)
      .values({
        course_description: body.description,
        course_price: body.price,
        course_title: body.title,
        course_sequence: body.sequence,
      })
      .execute()
      .catch(() => {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      });
  }

  async findAll() {
    return await CourseEntity.find({
      order: {
        course_sequence: 'ASC',
      },
    }).catch(() => {
      throw new HttpException('BAD GATEWAY', HttpStatus.BAD_GATEWAY);
    });
  }

  async update(body: UpdateCourseDto, id: string) {
    const course = await CourseEntity.findOneBy({
      course_id: id,
    }).catch(() => {
      throw new HttpException('Course Not Found', HttpStatus.NOT_FOUND);
    });
    if (!course) {
      throw new HttpException('Course Not Found', HttpStatus.NOT_FOUND);
    }

    await CourseEntity.createQueryBuilder()
      .update()
      .set({
        course_description: body.description || course.course_description,
        course_price: body.price || course.course_price,
        course_title: body.title || course.course_title,
        course_sequence: body.sequence || course.course_sequence,
      })
      .where({
        course_id: id,
      })
      .execute()
      .catch(() => {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      });
  }

  async remove(id: string) {
    const course = await CourseEntity.findOneBy({
      course_id: id,
    }).catch(() => {
      throw new HttpException('Course Not Found', HttpStatus.NOT_FOUND);
    });
    if (!course) {
      throw new HttpException('Course Not Found', HttpStatus.NOT_FOUND);
    }

    await CourseEntity.createQueryBuilder()
      .delete()
      .from(CourseEntity)
      .where({
        course_id: id,
      })
      .execute()
      .catch((err) => {
        console.log(err);
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      });
  }
}
