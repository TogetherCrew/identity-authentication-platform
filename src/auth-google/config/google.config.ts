import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export default registerAs('google', () => ({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
    scopes: process.env.GOOGLE_SCOPES
        ? process.env.GOOGLE_SCOPES.split(' ')
        : ['identify'],
}));

export const googleConfigSchema = {
    GOOGLE_CLIENT_ID: Joi.string().required().description('Google clinet id'),
    GOOGLE_CLIENT_SECRET: Joi.string()
        .required()
        .description('Google clinet secret'),
    GOOGLE_REDIRECT_URI: Joi.string()
        .uri()
        .required()
        .description('Google redirect URI after OAuth'),
    GOOGLE_SCOPES: Joi.string()
        .default('profile')
        .description('Google OAuth scopes'),
};
