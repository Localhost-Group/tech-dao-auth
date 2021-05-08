import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import rabbitMqLink from './consts';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMqLink],
      queue: 'AUTH_SERVICE',
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.startAllMicroservicesAsync();
  await app.listen(3000);
  Logger.log('Auth microservice running');
}
bootstrap();
