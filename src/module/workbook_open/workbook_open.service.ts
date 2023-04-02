import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { WorkbookOpen } from 'src/entities/workbook_open.entity';
import { Repository } from 'typeorm';
import { CreateWorkbookOpenDto } from './dto/create-workbook_open.dto';
import { CourseEntity } from 'src/entities/course.entity';
import { UpdateWorkbookOpenDto } from './dto/update-workbook_open.dto';

@Injectable()
export class WorkbookOpenService {
  constructor(readonly workbookopenRepo: Repository<WorkbookOpen>) {}

  async get(id: any): Promise<any> {
    if (id == 'false' || id == 'undefined') {
      return []
    }
    return await CourseEntity.findOne({
      where: {
        course_id: id,
      },
      relations: {
        workbook_open: true
      },
      order: {
        workbook_open: {
          openbook_sequence: 'ASC'
        },
      },
    }).catch(() => {
      throw new HttpException('Course Not Found', HttpStatus.NOT_FOUND);
    });
  }

  async one(id: any) {
    if (id == 'false' || id == 'undefined') {
      return
    }

    //
  }

  async create(payload: CreateWorkbookOpenDto, file: any): Promise<void> {
    const findCourse: any = await CourseEntity.findOneBy({
      course_id: payload.courseId,
    }).catch(() => {
      throw new HttpException('Course Not Found', HttpStatus.NOT_FOUND);
    });
    if (!findCourse) {
      throw new HttpException('Course Not Found', HttpStatus.NOT_FOUND);
    }

    const findWorkbook: any = await CourseEntity.findOne({
      where: {
        course_id: findCourse.course_id,
      },
      relations: {
        workbook_open: true
      },
      order: {
        workbook_open: {
          openbook_sequence: 'ASC'
        },
      },
    })
    .catch((e) => {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    });
    
    for (let i = 0; i < findWorkbook.workbook_open.length; i++) {
      if (findWorkbook.workbook_open[i].openbook_sequence == payload.sequence) {
        throw new HttpException('Book Already added', HttpStatus.BAD_REQUEST);
      }
    }

    await WorkbookOpen.createQueryBuilder()
      .insert()
      .into(WorkbookOpen)
      .values({
        openbook_link: file,
        openbook_course: findCourse,
        openbook_sequence: payload.sequence,
      })
      .execute()
      .catch((): unknown => {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      });
  }

  async update(
    payload: UpdateWorkbookOpenDto,
    file: string | boolean,
    id: string,
  ): Promise<void> {
    const findCourse = await CourseEntity.findOneBy({
      course_id: payload.courseId,
    }).catch(() => {
      throw new HttpException('Course Not Found', HttpStatus.NOT_FOUND);
    });
    if (!findCourse) {
      throw new HttpException('Course Not Found', HttpStatus.NOT_FOUND);
    }

    const findWorkbook: any = await WorkbookOpen.findOneBy({
      openbook_id: id,
    }).catch(() => {
      throw new HttpException('Workbook Not Found', HttpStatus.NOT_FOUND);
    });
    if (!findWorkbook) {
      throw new HttpException('Workbook Not Found', HttpStatus.NOT_FOUND);
    }

    const find: any = await CourseEntity.findOne({
      where: {
        course_id: findCourse.course_id,
      },
      relations: {
        workbook_open: true
      },
      order: {
        workbook_open: {
          openbook_sequence: 'ASC'
        },
      },
    })
    .catch((e) => {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    });
    
    for (let i = 0; i < find.workbook_open.length; i++) {
      if (find.workbook_open[i].openbook_sequence == payload.sequence) {
        throw new HttpException('Book Already added', HttpStatus.BAD_REQUEST);
      }
    }

    await WorkbookOpen.createQueryBuilder()
      .update(WorkbookOpen)
      .set({
        openbook_course: payload.courseId || findWorkbook.openbook_course,
        openbook_sequence: payload.sequence || findWorkbook.openbook_sequence,
        openbook_link: file || findWorkbook.openbook_link,
      })
      .where({ openbook_id: id })
      .execute();
  }

  async delete(id: string) {
    const findWorkbook: any = await WorkbookOpen.findOneBy({
      openbook_id: id,
    }).catch(() => {
      throw new HttpException('Workbook Not Found', HttpStatus.NOT_FOUND);
    });
    if (!findWorkbook) {
      throw new HttpException('Workbook Not Found', HttpStatus.NOT_FOUND);
    }

    await WorkbookOpen.createQueryBuilder()
      .delete()
      .from(WorkbookOpen)
      .where({ openbook_id: id })
      .execute();
  }
}
