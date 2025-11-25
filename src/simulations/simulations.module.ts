import { Module } from '@nestjs/common';
import { SimulationsController } from './simulations.controller';
import { RabbitModule } from 'src/transports/rabbitmq/rabbit.module';
import { RedisModule } from 'src/transports/redis/redis.module';
import { RedisService } from 'src/transports/redis/redis.service';
import { SimulationsGateway } from './simulations.gateway';

@Module({
  imports: [RabbitModule, RedisModule],
  controllers: [SimulationsController],
  providers: [SimulationsGateway, RedisService],
})
export class SimulationsModule {}
