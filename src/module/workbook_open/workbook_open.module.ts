import { Module } from '@nestjs/common';
import { WorkbookOpenService } from './workbook_open.service';
import { WorkbookOpenController } from './workbook_open.controller';
import { TokenMiddleware } from 'src/middleware/middleware.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkbookOpen } from 'src/entities/workbook_open.entity';
import { Repository } from 'typeorm';

@Module({
  controllers: [WorkbookOpenController],
  providers: [WorkbookOpenService, TokenMiddleware, Repository],
  imports: [TypeOrmModule.forFeature([WorkbookOpen])],
})
export class WorkbookOpenModule {}
