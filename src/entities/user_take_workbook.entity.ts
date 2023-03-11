import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { Workbook } from './workbook.entity';

@Entity({ name: 'user_take_workbook' })
export class UserTakeWorkbook extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  utw_id: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  utw_connection: string;

  @Column({
    type: 'boolean',
    default: true,
    nullable: false,
  })
  utw_active: boolean;

  @ManyToOne(() => Workbook, (workbook) => workbook.take_user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workbook_id' })
  workbook_id: Workbook;

  @ManyToOne(() => UserEntity, (user) => user.take_workbook, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user_id: UserEntity;
}
