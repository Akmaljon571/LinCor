import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { WorkbookOpen } from 'src/entities/workbook_open.entity';
import { Repository } from 'typeorm';
import { CreateWorkbookOpenDto } from './dto/create-workbook_open.dto';
import { CourseEntity } from 'src/entities/course.entity';
import { UpdateWorkbookOpenDto } from './dto/update-workbook_open.dto';

@Injectable()
export class WorkbookOpenService {
  constructor(readonly workbookopenRepo: Repository<WorkbookOpen>) {}

  async get(): Promise<any> {
    return await WorkbookOpen.find({
      relations: {
        openbook_course: true,
      },
    });
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
