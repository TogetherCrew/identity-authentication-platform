import * as Joi from 'joi'
import { registerAs } from '@nestjs/config'

export default registerAs('lit', () => ({
    network: process.env.JWT_SECRET,
}))

export const authConfigSchema = {
    LIT_NETWORK: Joi.string().required().description('Lit network'),
}
