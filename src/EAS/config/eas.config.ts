import * as Joi from 'joi'
import { registerAs } from '@nestjs/config'

export default registerAs('eas', () => ({
    contractAddress: process.env.EAS_CONTRACT_ADDRESS,
    schemaUUID: process.env.EAS_SCHEMA_UUID,
    provider: process.env.EAS_PROVIDER,
}))

export const easConfigSchema = {
    EAS_CONTRACT_ADDRESS: Joi.string()
        .required()
        .description('EAS contract address'),
    EAS_SCHEMA_UUID: Joi.string()
        .default('0xC2679fBD37d54388Ce493F1DB75320D236e1815e')
        .description('EAS Schema UUID'),
    EAS_PROVIDER: Joi.string()
        .default('sepolia')
        .valid('sepolia', 'mainnet')
        .description('EAS provider'),
}
