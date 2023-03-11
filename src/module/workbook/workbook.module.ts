import { Module } from '@nestjs/common';
import { WorkbookService } from './workbook.service';
import { WorkbookController } from './workbook.controller';
import { TokenMiddleware } from '../../middleware/middleware.service';

@Module({
  controllers: [WorkbookController],
  providers: [WorkbookService, TokenMiddleware],
})
export class WorkbookModule {}
