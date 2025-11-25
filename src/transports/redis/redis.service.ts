import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { envs } from 'src/config';

@Injectable()
export class RedisService {
    constructor(
        @Inject(envs.redisClient)
        private readonly redisClient: Redis
    ){}

    async subscribe(channel: string, callback: (msg: string) => void) {
        const subscriber = this.redisClient.duplicate();
        await subscriber.subscribe(channel);
        subscriber.on('message', (_, message) => callback(message));
    }

}
