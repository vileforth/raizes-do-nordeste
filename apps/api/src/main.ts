import { existsSync } from 'node:fs';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  if (existsSync('.env')) {
    process.loadEnvFile();
  }
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const loggerService = app.get(LoggerService);

  app.enableCors({
    origin: process.env.WEB_ORIGIN ?? 'http://localhost:4000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Raizes do Nordeste API')
    .setDescription('Franchise platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port, '0.0.0.0');
  loggerService.info('API started', { port });
}

bootstrap();
