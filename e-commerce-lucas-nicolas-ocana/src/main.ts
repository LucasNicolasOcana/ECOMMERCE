import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('NestJs API // ECOMMERCE')
    .setDescription('Proyecto Integrador BACKEND')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
    
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document)
  app.use(loggerMiddleware);
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000);
}
bootstrap();
