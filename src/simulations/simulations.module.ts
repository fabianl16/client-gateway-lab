import { Module } from '@nestjs/common';
import { SimulationsController } from './simulations.controller';
import { RabbitModule } from 'src/transports/rabbit.module';

@Module({
  imports: [RabbitModule],
  controllers: [SimulationsController],
})
export class SimulationsModule {}
