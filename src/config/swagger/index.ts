import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Lin Core project')
  .setVersion('1.0')
  .build();
