import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { envs } from 'src/config';
import { SimulationPayloadDto } from './dto';

@Controller('simulations')
export class SimulationsController implements OnModuleInit{

  constructor(
    @Inject(envs.rabbitmqService) private readonly rabbitClient: ClientProxy,
  ) {}
  async onModuleInit() {
    await this.rabbitClient.connect();
    console.log('Cliente RabbitMQ conectado');
  }

  @Post()
  async startSimulation(@Body() simulationDto: SimulationPayloadDto) {
  
    this.rabbitClient.emit(envs.rabbitmqGatewayQueue, simulationDto);

    return { message: 'Simulation request sent successfully' };
  }
}




