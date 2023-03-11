import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { Videos } from './video.entity';

@Entity({ name: 'user_watch_video' })
export class UserWatchVideo extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uwv_id: string;

  @ManyToOne(() => Videos, (video) => video.user_watch_video, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'video_id' })
  video_id: Videos;

  @ManyToOne(() => UserEntity, (user) => user.watch_video, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user_id: UserEntity;
}
