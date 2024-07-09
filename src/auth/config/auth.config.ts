import * as Joi from 'joi';
import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: parseInt(process.env.JWT_EXPIRATION_MINUTES, 10) || 60,
}));

export const authConfigSchema = {
  JWT_SECRET: Joi.string().required().description('JWT secret'),
  JWT_EXPIRATION_MINUTES: Joi.number().default(60).description('JWT expiration time in minutes'),
};
