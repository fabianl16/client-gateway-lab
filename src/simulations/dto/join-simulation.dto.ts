import { IsUUID } from 'class-validator';

export class JoinSimulationDto {
  @IsUUID()
  id: string;
}