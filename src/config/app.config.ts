import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10),
  sessionSecret: process.env.SESSION_SECRET,
}));

export const appConfigSchema = {
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required().description('Application environment'),
  PORT: Joi.number().default(3000).required().description('Application port'),
  SESSION_SECRET: Joi.string().required().description('Session Secret'),
};
