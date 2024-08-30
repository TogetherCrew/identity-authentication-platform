import * as Joi from 'joi'
import { registerAs } from '@nestjs/config'

export default registerAs('jwt', () => ({
    secret: process.env.JWT_SECRET,
    algorithm: process.env.JWT_ALGORITHM,
    userExpirationMinutes:
        parseInt(process.env.JWT_USER_EXPIRATION_MINUTES, 10) || 60,
    discourseVerificationExpirationMinutes:
        parseInt(
            process.env.JWT_DISCOURSE_VERIFICATION_EXPIRATION_MINUTES,
            10
        ) || 10,
}))

export const authConfigSchema = {
    JWT_SECRET: Joi.string().required().description('JWT secret'),
    JWT_ALGORITHM: Joi.string()
        .default('HS256')
        .description('JWT sign algoritm'),
    JWT_USER_EXPIRATION_MINUTES: Joi.number()
        .default(60)
        .description('user jwt expiration time in minutes'),
    JWT_DISCOURSE_VERIFICATION_EXPIRATION_MINUTES: Joi.number()
        .default(10)
        .description('discourse verification jwt expiration time in minutes'),
}
