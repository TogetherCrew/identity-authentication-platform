import * as Joi from 'joi';
import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
}));

export const authConfigSchema = {
  JWT_SECRET: Joi.string().required().description('JWT secret'),
};
