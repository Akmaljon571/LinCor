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
import { UserWatchVideo } from './user_watch_video.entity';

@Entity({ name: 'videos' })
export class Videos extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  video_id: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  video_link: string;

  @Column({
    type: 'character varying',
    length: 100,
    nullable: false,
  })
  video_title: string;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  video_description: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  video_duration: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  video_sequence: number;

  @ManyToOne(() => CourseEntity, (course) => course.course_videos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'videos_course' })
  videos_course: CourseEntity;

  @OneToMany(() => UserWatchVideo, (watch) => watch.video_id)
  user_watch_video: UserWatchVideo[];
}
