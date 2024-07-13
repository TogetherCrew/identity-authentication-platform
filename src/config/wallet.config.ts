import * as Joi from 'joi'
import { registerAs } from '@nestjs/config'

export default registerAs('wallet', () => ({
    privateKey: process.env.WALLET_PRIVATE_KEY,
    publicKey: process.env.WALLET_PUBLIC_KEY,
}))

export const walletConfigSchema = {
    WALLET_PRIVATE_KEY: Joi.string()
        .required()
        .description('Wallet private key'),
    WALLET_PUBLIC_KEY: Joi.string().required().description('Wallet public key'),
}
