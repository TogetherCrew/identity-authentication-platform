import * as Joi from 'joi';
import { registerAs } from '@nestjs/config';
import { LitNetwork } from '@lit-protocol/constants';

export default registerAs('lit', () => ({
    network: process.env.LIT_NETWORK,
}));

export const litConfigSchema = {
    LIT_NETWORK: Joi.string()
        .required()
        .description('Lit network')
        .valid(LitNetwork.Datil, LitNetwork.DatilTest, LitNetwork.DatilDev),
};
