import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  // on instancie l'application
  const app = await NestFactory.create(AppModule);

  // activation globalement des pipes de validation dans l'app
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    // activation des CORS
    app.enableCors({ origin: 'http://localhost:3000', credentials: true });

  // activation global des cookies
  app.use(cookieParser());

  // initialisation de swagger
  const swaggerOptions = new DocumentBuilder()
    .setTitle('VinyCherry')
    .setDescription('The VinyCherry API description')
    .setVersion('1.0')
    .addTag('vinycherry')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api', app, document);

  // on exécute le serveur sur le port 8000
  await app.listen(8000);
}
bootstrap();
