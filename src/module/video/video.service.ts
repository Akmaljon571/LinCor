import { UserWatchVideo } from './../../entities/user_watch_video.entity';
import { extname } from 'path';
import { CoursesOpenUsers } from './../../entities/course_open_users.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CourseEntity } from 'src/entities/course.entity';
import { Videos } from 'src/entities/video.entity';
import { CreateVideoDto } from './dto/create-video.dto';

@Injectable()
export class VideoService {
  async create(createVideoDto: CreateVideoDto, link) {
    const course = await CourseEntity.findOneBy({
      course_id: createVideoDto.course_id,
    }).catch(() => {
      throw new HttpException('Course Not Found', HttpStatus.NOT_FOUND);
    });

    if (!course) {
      throw new HttpException('Course Not Found', HttpStatus.NOT_FOUND);
    }

    await Videos.createQueryBuilder()
      .insert()
      .into(Videos)
      .values({
        video_link: link,
        video_title: createVideoDto.title,
        video_description: createVideoDto.description,
        video_duration: createVideoDto.duration,
        video_sequence: createVideoDto.sequence,
        videos_course: course,
      })
      .execute()
      .catch((e) => {
        console.log(e);
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      });
  }

  async findAll(course: string, header) {
    const findCourse: any = await CourseEntity.findOneBy({
      course_id: course,
    }).catch(() => {
      throw new HttpException('Course Not Found', HttpStatus.NOT_FOUND);
    });

    if (!course) {
      throw new HttpException('Course Not Found', HttpStatus.NOT_FOUND);
    }

    const allVideos: any = await Videos.find({
      where: {
        videos_course: findCourse,
      },
      order: {
        video_sequence: 'ASC',
      },
    }).catch((e) => e);

    const newObj = [...allVideos];

    if (header) {
      const active: any = await CoursesOpenUsers.findOne({
        where: {
          course_id: findCourse.course_id,
          user_id: header,
        },
      }).catch(() => {
        throw new HttpException('Course Not Found', HttpStatus.NOT_FOUND);
      });
      if (active) {
        const attheMoment: number = new Date().getTime();
        const dataByCourse = active.create_data.getTime();
        if (attheMoment - dataByCourse <= 15552000000) {
          for (let i = 0; i < newObj.length; i++) {
            newObj[i].video_active = true;
          }
          return newObj;
        } else {
          await CoursesOpenUsers.createQueryBuilder()
            .delete()
            .from(CoursesOpenUsers)
            .where({ cou_id: active.cou_id })
            .execute();

          for (let i = 0; i < newObj.length; i++) {
            newObj[i].video_active = true;
            if (newObj[i].video_sequence > 2) {
              newObj[i].video_active = false;
              const videoname = extname(newObj[i].video_link);
              newObj[i].video_link =
                'adsfdhgk' +
                allVideos.video_link +
                'adsfh'.split('').reverse().join('.')[0] +
                videoname;
            }
          }

          return newObj;
        }
      } else {
        for (let i = 0; i < newObj.length; i++) {
          newObj[i].video_active = true;
          if (newObj[i].video_sequence > 2) {
            newObj[i].video_active = false;
            const videoname = extname(newObj[i].video_link);
            newObj[i].video_link =
              'adsfdhgk' +
              allVideos.video_link +
              'adsfh'.split('').reverse().join('.')[0] +
              videoname;
          }
        }

        return newObj;
      }
    } else {
      for (let i = 0; i < newObj.length; i++) {
        newObj[i].video_active = true;

        if (newObj[i].video_sequence > 2) {
          newObj[i].video_active = false;
          const videoname = extname(newObj[i].video_link);
          newObj[i].video_link =
            'adsfdhgk' +
            allVideos.video_link +
            'adsfh'.split('').reverse().join('.')[0] +
            videoname;
        }
      }

      return newObj;
    }
  }

  async findOne(id: string, header: any) {
    const findVideo: any = await Videos.findOne({
      relations: { videos_course: true },
      where: { video_id: id },
    }).catch(() => {
      throw new HttpException('Video Not Found', HttpStatus.NOT_FOUND);
    });

    if (!findVideo) {
      throw new HttpException('Video Not Found', HttpStatus.NOT_FOUND);
    }
    const findCourse: any = await CourseEntity.findOneBy({
      course_id: findVideo.videos_course.course_id,
    }).catch(() => {
      throw new HttpException('Course Not Found', HttpStatus.NOT_FOUND);
    });
    delete findVideo.videos_course;
    const newObj = { ...findVideo };

    if (header) {
      await UserWatchVideo.createQueryBuilder()
        .insert()
        .into(UserWatchVideo)
        .values({
          video_id: findVideo.video_id,
          user_id: header,
        })
        .execute();
      const active = await CoursesOpenUsers.findOne({
        where: {
          course_id: findCourse.course_id,
          user_id: header,
        },
      }).catch((e) => console.log(e));
      if (active) {
        newObj.video_active = true;

        return newObj;
      } else {
        newObj.video_active = true;
        if (newObj.video_sequence > 2) {
          newObj.video_active = false;
          const videoname = extname(newObj.video_link);
          newObj.video_link =
            'adsfdhgk' +
            newObj.video_link +
            'adsfh'.split('').reverse().join('.')[0] +
            videoname;
        }

        return newObj;
      }
    } else {
      newObj.video_active = true;

      if (newObj.video_sequence > 2) {
        newObj.video_active = false;
        const videoname = extname(newObj.video_link);
        newObj.video_link =
          'adsfdhgk' +
          newObj.video_link +
          'adsfh'.split('').reverse().join('.')[0] +
          videoname;
      }

      return newObj;
    }
  }

  async update(id: string, body: any, file) {
    const findVideo = await Videos.findOne({
      where: { video_id: id },
      order: {
        video_sequence: 'ASC',
      },
    }).catch(() => {
      throw new HttpException('Video Not Found', HttpStatus.NOT_FOUND);
    });

    if (!findVideo) {
      throw new HttpException('Video Not Found', HttpStatus.NOT_FOUND);
    }

    await Videos.createQueryBuilder()
      .update()
      .set({
        video_description: body.description || findVideo.video_description,
        video_duration: body.duration || findVideo.video_duration,
        video_title: body.title || findVideo.video_title,
        video_link: file || findVideo.video_link,
        video_sequence: body.sequence || findVideo.video_sequence,
        videos_course: body.course_id || findVideo.videos_course,
      })
      .where({
        video_id: id,
      })
      .execute();
  }

  async delete(id: string) {
    const findVideo = await Videos.findOne({
      where: { video_id: id },
    }).catch(() => {
      throw new HttpException('Video Not Found', HttpStatus.NOT_FOUND);
    });

    if (!findVideo) {
      throw new HttpException('Video Not Found', HttpStatus.NOT_FOUND);
    }

    await Videos.createQueryBuilder()
      .delete()
      .from(Videos)
      .where({
        video_id: id,
      })
      .execute();
  }
}
