import * as Joi from 'joi';

import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
    secret: process.env.JWT_SECRET,
    authExpiresIn: parseInt(process.env.JWT_AUTH_EXPIRATION_MINUTES, 10) || 60,
    discourseVerificationExpiresIn:
        parseInt(process.env.JWT_VERIFICATION_MINUTES, 10) || 10,
}));

export const jwtConfigSchema = {
    JWT_SECRET: Joi.string().required().description('JWT secret'),
    JWT_AUTH_EXPIRATION_MINUTES: Joi.number()
        .default(6000)
        .description('JWT expiration time in minutes for the auth'),
    JWT_VERIFICATION_MINUTES: Joi.number()
        .default(1000)
        .description('JWT expiration time in minutes for the verification'),
};
