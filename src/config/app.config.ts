import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10),
}));

export const appConfigSchema = {
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
  PORT: Joi.number().default(3000).required(),
};
