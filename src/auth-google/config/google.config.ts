import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export default registerAs('google', () => ({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackUri: process.env.GOOGLE_CALLBACK_URI,
}));

export const googleConfigSchema = {
  GOOGLE_CLIENT_ID: Joi.string().required().description('Google clinet id'),
  GOOGLE_CLIENT_SECRET: Joi.string().required().description('Google clinet secret'),
  GOOGLE_CALLBACK_URI: Joi.string().uri().required().description('Google callback uri'),
};
