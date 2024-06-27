import { ConfigService } from '@nestjs/config';
import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const pinoConfig = (configService: ConfigService) => {
  const nodeEnv = configService.get('app.nodeEnv');
  return {
    pinoHttp: {
      level: nodeEnv !== 'production' ? 'debug' : 'info',
      transport:
        nodeEnv !== 'production'
          ? {
              target: 'pino-pretty',
              options: {
                singleLine: true,
              },
            }
          : undefined,
      formatters: {
        level: label => {
          return { level: label.toUpperCase() };
        },
      },
      timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
    },
  };
};

export default registerAs('logger', () => ({
  level: process.env.LOG_LEVEL || 'info',
}));

export const loggerConfigSchema = {
  LOG_LEVEL: Joi.string().valid('fatal', 'error', 'warn', 'info', 'debug', 'trace').default('info').required(),
};
