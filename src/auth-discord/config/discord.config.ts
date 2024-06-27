import * as Joi from 'joi';
import { registerAs } from '@nestjs/config';

export default registerAs('discord', () => ({
  clientId: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackUri: process.env.DISCORD_CALLBACK_URI,
}));

export const discordConfigSchema = {
  DISCORD_CLIENT_ID: Joi.string().required().description('Discord clinet id'),
  DISCORD_CLIENT_SECRET: Joi.string().required().description('Discord clinet secret'),
  DISCORD_CALLBACK_URI: Joi.string().uri().required().description('Discord callback uri'),
};
