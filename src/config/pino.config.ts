import { ConfigService } from '@nestjs/config';

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
