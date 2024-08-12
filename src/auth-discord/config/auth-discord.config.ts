// config/discord.config.ts
import * as Joi from 'joi'
import { registerAs } from '@nestjs/config'

export default registerAs('discord', () => ({
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    redirectUri: process.env.DISCORD_REDIRECT_URI,
    scopes: process.env.DISCORD_SCOPES
        ? process.env.DISCORD_SCOPES.split(' ')
        : ['identify'],
}))

export const discordConfigSchema = {
    DISCORD_CLIENT_ID: Joi.string().required().description('Discord client ID'),
    DISCORD_CLIENT_SECRET: Joi.string()
        .required()
        .description('Discord client secret'),
    DISCORD_REDIRECT_URI: Joi.string()
        .uri()
        .required()
        .description('Discord redirect URI after OAuth'),
    DISCORD_SCOPES: Joi.string()
        .default('identify')
        .description('Discord OAuth scopes'),
}
