import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from 'src/transports/redis/redis.service';
import { JoinSimulationDto } from './dto';
import { envs } from 'src/config';
import { SimulationProgressPayload } from './interfaces/simulation-progress-payload.interface';
import { JobStatus } from 'src/common/constants';
@WebSocketGateway({
  namespace: envs.redisSimulationNameSpace,
  cors:{
    origin: '*',
  }
})
@Injectable()
export class SimulationsGateway implements OnModuleInit{

  private readonly logger = new Logger(SimulationsGateway.name);
  @WebSocketServer() server: Server;

  constructor( private readonly redisService: RedisService){}

  private roomName(simulationId: string) {
    return `simulation:${simulationId}`;
  }

  async onModuleInit() {
    const channel = envs.redisSimulationChannel;
    await this.redisService.subscribe(channel, (message) => {
      try {
        const raw = JSON.parse(message);
        const payload: SimulationProgressPayload = JSON.parse(raw);
        const { job_id, status } = payload;
        const room = this.roomName(job_id);

        this.server.to(room).emit(envs.redisSimulationEvent, payload);

        if(status === JobStatus.FINISH){
          this.closeRoom(room);
        }
      } catch (err) {
        this.logger.error('Invalid message from Redis', err);
      }
    });
  }

  @SubscribeMessage('joinSimulation')
  handleJoinSimulation(@MessageBody() data: JoinSimulationDto, @ConnectedSocket() client: Socket) {
    const room = this.roomName(data.id);
    client.join(room);
  }

  @SubscribeMessage('leaveSimulation')
  handleLeaveSimulation(@MessageBody() data: JoinSimulationDto, @ConnectedSocket() client: Socket) {
    const room = this.roomName(data.id);
    client.leave(room);
  }

  private closeRoom(roomName: string): void {
    this.server.socketsLeave(roomName);
  }

}
