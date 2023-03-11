import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CourseEntity } from './course.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'courses_open_users' })
export class CoursesOpenUsers extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  cou_id: string;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;

  @ManyToOne(() => UserEntity, (user) => user.open_course, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user_id: UserEntity;

  @ManyToOne(() => CourseEntity, (course) => course.open_user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course_id: CourseEntity;
}
