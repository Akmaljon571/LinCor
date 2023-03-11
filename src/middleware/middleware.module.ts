import { Module } from '@nestjs/common';
import { TokenMiddleware } from './middleware.service';

@Module({
  providers: [TokenMiddleware],
})
export class MiddlewareModule {}
