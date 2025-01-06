import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export default registerAs('wallet', () => ({
    privateKey: process.env.WALLET_PRIVATE_KEY,
}));

export const walletConfigSchema = {
    WALLET_PRIVATE_KEY: Joi.string()
        .required()
        .description('Wallet private key'),
};
