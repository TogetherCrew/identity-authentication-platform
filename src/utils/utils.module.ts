import { Module } from '@nestjs/common'
import { CryptoUtilsService } from './crypto-utils.service'
import { EncodeUtilsService } from './encode-utils.service'
import { ViemUtilsService } from './viem.utils.service'

@Module({
    providers: [CryptoUtilsService, EncodeUtilsService, ViemUtilsService],
    exports: [CryptoUtilsService, EncodeUtilsService, ViemUtilsService],
})
export class UtilsModule {}
