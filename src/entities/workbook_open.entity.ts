import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CourseEntity } from './course.entity';

@Entity({ name: 'workbook_open' })
export class WorkbookOpen extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  openbook_id: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  openbook_link: string;

  @ManyToOne(() => CourseEntity, (course) => course.workbook_open, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'openbook_course' })
  openbook_course: CourseEntity;

  @Column({
    type: 'integer',
    nullable: false,
  })
  openbook_sequence: number;
}
