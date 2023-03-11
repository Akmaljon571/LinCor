import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CourseEntity } from './course.entity';
import { UserTakeWorkbook } from './user_take_workbook.entity';

@Entity({ name: 'workbook' })
export class Workbook extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  workbook_id: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  workbook_link: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  workbook_sequence: number;

  @ManyToOne(() => CourseEntity, (course) => course.workbook, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workbook_course' })
  workbook_course: CourseEntity;

  @OneToMany(() => UserTakeWorkbook, (workbook) => workbook.workbook_id)
  take_user: UserTakeWorkbook[];
}
