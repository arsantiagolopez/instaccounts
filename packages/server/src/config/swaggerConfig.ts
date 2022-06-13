import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Instaccounts API')
  .setDescription('Instaccounts API built with NestJS.')
  .setVersion('1.0')
  .setContact(
    'Alexander Santiago',
    'https://alexandersantiago.com',
    'arsantiagolopez@gmail.com',
  )
  .build();
