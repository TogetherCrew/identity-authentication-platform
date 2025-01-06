import * as Joi from 'joi';

import discordConfig, {
    discordConfigSchema,
} from '../auth-discord/config/auth-discord.config';
import googleConfig, {
    googleConfigSchema,
} from '../auth-google/config/google.config';
import authConfig, { authConfigSchema } from '../auth/config/auth.config';
import jwtConfig, { jwtConfigSchema } from '../jwt/config/jwt.config';
import litConfig, { litConfigSchema } from '../lit/config/lit.config';
import appConfig, { appConfigSchema } from './app.config';
import loggerConfig, { loggerConfigSchema } from './logger.config';
import walletConfig, { walletConfigSchema } from './wallet.config';

export const configModules = [
    appConfig,
    googleConfig,
    discordConfig,
    loggerConfig,
    authConfig,
    walletConfig,
    litConfig,
    jwtConfig,
];

export const configValidationSchema = Joi.object({
    ...appConfigSchema,
    ...googleConfigSchema,
    ...discordConfigSchema,
    ...authConfigSchema,
    ...loggerConfigSchema,
    ...loggerConfigSchema,
    ...loggerConfigSchema,
    ...walletConfigSchema,
    ...litConfigSchema,
    ...jwtConfigSchema,
});
