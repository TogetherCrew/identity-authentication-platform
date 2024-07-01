import * as Joi from 'joi';
import googleConfig, { googleConfigSchema } from '../auth-google/config/google.config';
import discordConfig, { discordConfigSchema } from '../auth-discord/config/discord.config';
import authConfig, { authConfigSchema } from '../auth/config/auth.config';
import appConfig, { appConfigSchema } from './app.config';
import loggerConfig, { loggerConfigSchema } from './logger.config';

export const configModules = [appConfig, googleConfig, discordConfig, loggerConfig, authConfig];

export const configValidationSchema = Joi.object({
  ...appConfigSchema,
  ...googleConfigSchema,
  ...discordConfigSchema,
  ...authConfigSchema,
  ...loggerConfigSchema,
});