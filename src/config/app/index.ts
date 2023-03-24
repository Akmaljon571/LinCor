import { registerAs } from '@nestjs/config';

class AppConfig {
  readonly port: number;
}

export const appConfig = registerAs(
  'app',
  (): AppConfig => ({
    port: process.env.POST ? Number(process.env.POST) : undefined,
  }),
);
