import 'dotenv/config';

import * as joi from 'joi';


interface EnVars {
    GATEWAY_PORT: number;
    RABBITMQ_HOST: string;
    RABBITMQ_GATEWAY_QUEUE: string;
    RABBITMQ_SERVICE: string;
    RABBITMQ_USERNAME: string;
    RABBITMQ_PASSWORD: string;
    RABBITMQ_PORT: number,
    REDIS_CLIENT: string,
    REDIS_HOST: string,
    REDIS_PORT: number,
    REDIS_SIMULATION_CHANNEL: string,
    REDIS_SIMULATION_NAMESPACE: string, 
    REDIS_SIMULATION_EVENT: string
}


const envVarsSchema = joi.object({
    GATEWAY_PORT: joi.number().required(),
    RABBITMQ_HOST: joi.string().required(),
    RABBITMQ_GATEWAY_QUEUE: joi.string().required(),
    RABBITMQ_SERVICE: joi.string().required(),
    RABBITMQ_USERNAME: joi.string().required(),
    RABBITMQ_PASSWORD: joi.string().required(),
    RABBITMQ_PORT: joi.number().default(5672),
    REDIS_PORT: joi.number().required(),
    REDIS_CLIENT: joi.string().required(),
    REDIS_HOST: joi.string().required(),
    REDIS_SIMULATION_CHANNEL: joi.string().required(),
    REDIS_SIMULATION_NAMESPACE: joi.string().required(),
    REDIS_SIMULATION_EVENT: joi.string().required(),
}).unknown();

const { error, value } = envVarsSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnVars = value;

const rabbitmqUrl = `amqp://${envVars.RABBITMQ_USERNAME}:${envVars.RABBITMQ_PASSWORD}@${envVars.RABBITMQ_HOST}:${envVars.RABBITMQ_PORT}`;
const redisUrl = `redis://${envVars.REDIS_HOST}:${envVars.REDIS_PORT}`;
export const envs = {
    nestJsPort: envVars.GATEWAY_PORT,
    redisUrl,
    redisClient: envVars.REDIS_CLIENT,
    redisSimulationChannel: envVars.REDIS_SIMULATION_CHANNEL,
    redisSimulationNameSpace: envVars.REDIS_SIMULATION_NAMESPACE,
    redisSimulationEvent: envVars.REDIS_SIMULATION_EVENT,
    rabbitmqUrl,
    rabbitmqGatewayQueue: envVars.RABBITMQ_GATEWAY_QUEUE,
    rabbitmqService: envVars.RABBITMQ_SERVICE,
}
