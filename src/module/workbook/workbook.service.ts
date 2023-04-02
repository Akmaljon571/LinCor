import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateWorkbookDto } from './dto/create-workbook.dto';
import { Workbook } from 'src/entities/workbook.entity';
import { UpdateWorkbookDto } from './dto/update-workbook.dto';
import { CourseEntity } from 'src/entities/course.entity';
import { HttpException } from '@nestjs/common';

@Injectable()
export class WorkbookService {
  async find(id: string) {
    if (id == 'false' || id == 'undefined') {
      return []
    }
    return await CourseEntity.findOne({
      where: {
        course_id: id,
      },
      relations: {
        workbook: true
      },
      order: {
        workbook: {
          workbook_sequence: 'ASC'
        },
      },
    }).catch(() => {
      throw new HttpException('Course Not Found', HttpStatus.NOT_FOUND);
    });
  }

  async createWorkBook(
    workbookbody: CreateWorkbookDto,
    worklink: any,
  ): Promise<void> {
    const course = await CourseEntity.findOne({
      where: {
        course_id: workbookbody.courseId,
      },
    }).catch(() => {
      throw new HttpException('Course Not Found', HttpStatus.NOT_FOUND);
    });

    if (!course) {
      throw new HttpException('Course Not Found', HttpStatus.NOT_FOUND);
    }

    const findWorkbook: any = await CourseEntity.findOne({
      where: {
        course_id: course.course_id,
      },
      relations: {
        workbook: true
      },
      order: {
        workbook: {
          workbook_sequence: 'ASC'
        },
      },
    })
    .catch((e) => {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    });
    
    for (let i = 0; i < findWorkbook?.workbook?.length; i++) {
      if (findWorkbook.workbook[i].workbook_sequence == workbookbody.sequence) {
        throw new HttpException('Book Already added', HttpStatus.BAD_REQUEST);
      }
    }

    await Workbook.createQueryBuilder()
      .insert()
      .into(Workbook)
      .values({
        workbook_link: worklink,
        workbook_sequence: workbookbody.sequence,
        workbook_course: course,
      })
      .execute()
      .catch(() => {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      });
  }

  async updateWorkBook(
    workbookbody: UpdateWorkbookDto,
    worklink: any,
    id: string,
  ): Promise<void> {
    const workbook: any = await Workbook.findOne({
      where: {
        workbook_id: id,
      },
    }).catch(() => {
      throw new HttpException('WorkBook Not Found', HttpStatus.NOT_FOUND);
    });

    if (!workbook) {
      throw new HttpException('Workbook Not Found', HttpStatus.NOT_FOUND);
    }

    const findWorkbook: any = await CourseEntity.findOne({
      where: {
        course_id: workbook.workbook_course
      },
      relations: {
        workbook: true
      },
      order: {
        workbook: {
          workbook_sequence: 'ASC'
        },
      },
    })
    .catch(() => {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    });
    for (let i = 0; i < findWorkbook?.workbook?.length; i++) {
      if (findWorkbook.workbook[i].workbook_sequence == workbookbody.sequence) {
        throw new HttpException('Book Already added', HttpStatus.BAD_REQUEST);
      }
    }

    await Workbook.createQueryBuilder()
      .update()
      .set({
        workbook_sequence: workbookbody.sequence || workbook.workbook_sequence,
        workbook_course: workbookbody.courseId || workbook.workbook_course,
        workbook_link: worklink || workbook.workbook_link,
      })
      .where({
        workbook_id: id,
      })
      .execute()
      .catch(() => {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      });
  }

  async deleteWorkBook(id: string): Promise<void> {
    const findWorkbook = await Workbook.findOne({
      where: {
        workbook_id: id,
      },
    }).catch(() => {
      throw new HttpException('Workbook Not Found', HttpStatus.NOT_FOUND);
    });

    if (!findWorkbook) {
      throw new HttpException('Workbook Not Found', HttpStatus.NOT_FOUND);
    }
    await Workbook.createQueryBuilder()
      .delete()
      .from(Workbook)
      .where('workbook_id = :id', {
        id,
      })
      .execute();
  }
}
