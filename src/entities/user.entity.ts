import { UserWatchVideo } from './user_watch_video.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CoursesOpenUsers } from './course_open_users.entity';
import { UserTakeWorkbook } from './user_take_workbook.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({
    type: 'character varying',
    length: 65,
    nullable: false,
  })
  first_name: string;

  @Column({
    type: 'character varying',
    length: 65,
    nullable: false,
  })
  last_name: string;

  @Column({
    type: 'character varying',
    length: 30,
    nullable: false,
  })
  area: string;

  @Column({
    type: 'character varying',
    length: 100,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  password: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: true,
  })
  active: boolean;

  @Column({
    type: 'text',
    nullable: false,
    default:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png',
  })
  image: string;

  @OneToMany(() => UserTakeWorkbook, (workbook) => workbook.user_id)
  take_workbook: UserTakeWorkbook[];

  @OneToMany(() => CoursesOpenUsers, (course) => course.user_id)
  open_course: CoursesOpenUsers[];

  @OneToMany(() => UserWatchVideo, (watch) => watch.user_id)
  watch_video: UserWatchVideo[];
}
