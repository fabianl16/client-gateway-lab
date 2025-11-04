import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs, RpcCustomExceptionFilter } from './config';

async function bootstrap() {
  const logger = new Logger('Main-gateway');
  const appPort = envs.nestJsPort;
  const app = await NestFactory.create(AppModule);


  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new RpcCustomExceptionFilter());
  
  await app.listen(appPort);

  

  logger.log(`🚀 Gateway client running on http://localhost:${appPort}/api`);
}
bootstrap();
