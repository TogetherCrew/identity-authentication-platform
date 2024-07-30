// src/utils/utils.module.ts
import { Module } from '@nestjs/common'
import { CryptoUtilsService } from './crypto-utils.service'
import { EncodeUtilsService } from './encode-utils.service'
import { ViemService } from './viem.service'

@Module({
    providers: [CryptoUtilsService, EncodeUtilsService, ViemService],
    exports: [CryptoUtilsService, EncodeUtilsService, ViemService],
})
export class UtilsModule {}
