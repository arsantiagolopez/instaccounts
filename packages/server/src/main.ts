import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { swaggerConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService);
  const clientUrl = configService.get<string>('CLIENT_URL');
  const port = configService.get<string>('PORT')!;

  // Cookies
  app.use(cookieParser());

  // CORS
  app.enableCors({
    origin: clientUrl,
    credentials: true,
  });

  // Swagger
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/', app, document);

  await app.listen(port);
}
bootstrap();
