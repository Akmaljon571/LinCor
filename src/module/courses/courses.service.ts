import { HttpException } from '@nestjs/common/exceptions';
import { Injectable, HttpStatus } from '@nestjs/common';
import { CourseEntity } from 'src/entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  async create(body: CreateCourseDto, link: string) {
    await CourseEntity.createQueryBuilder()
      .insert()
      .into(CourseEntity)
      .values({
        course_description: body.description,
        course_price: body.price,
        course_title: body.title,
        course_sequence: body.sequence,
        course_link: link,
        course_bgc: body.bgcolor,
      })
      .execute()
      .catch(() => {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      });
  }

  async filter(id: string) {
    const course1: CourseEntity[] = await CourseEntity.find({
      relations: {
        course_videos: true,
      },
      where: {
        course_id: id,
      },
    }).catch(() => {
      throw new HttpException('BAD GATEWAY', HttpStatus.BAD_GATEWAY);
    });

    const course: CourseEntity[] = await CourseEntity.find({
      order: {
        course_sequence: 'ASC',
      },
    }).catch(() => {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    });

    const filter: any = course.filter((e) => e.course_id != id);

    for (let i = 0; i < filter.length; i++) {
      filter[i].videos_count = course1[i].course_videos.length;
    }

    return filter;
  }

  async findAll() {
    const course: any[] = await CourseEntity.find({
      order: {
        course_sequence: 'ASC',
      },
    }).catch(() => {
      throw new HttpException('BAD GATEWAY', HttpStatus.BAD_GATEWAY);
    });

    const course1: CourseEntity[] = await CourseEntity.find({
      order: {
        course_sequence: 'ASC',
      },
      relations: {
        course_videos: true,
      },
    }).catch(() => {
      throw new HttpException('BAD GATEWAY', HttpStatus.BAD_GATEWAY);
    });

    for (let i = 0; i < course.length; i++) {
      course[i].videos_count = course1[i].course_videos.length;
    }

    return course;
  }

  async findOne(id: string) {
    const course1: CourseEntity = await CourseEntity.findOne({
      relations: {
        course_videos: true,
      },
      where: {
        course_id: id,
      },
    }).catch(() => {
      throw new HttpException('BAD GATEWAY', HttpStatus.BAD_GATEWAY);
    });

    const course: any = await CourseEntity.findOne({
      where: {
        course_id: id,
      },
    }).catch(() => {
      throw new HttpException('BAD GATEWAY', HttpStatus.BAD_GATEWAY);
    });

    if (course) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    course.video_count = course1?.course_videos?.length;

    return course;
  }

  async update(body: UpdateCourseDto, id: string, link: any) {
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
        course_link: link || course.course_link,
        course_bgc: body.bgcolor || course.course_bgc,
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
      .catch(() => {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      });
  }
}
