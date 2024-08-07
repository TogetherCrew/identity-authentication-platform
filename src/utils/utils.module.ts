import { Module } from '@nestjs/common'
import { CryptoUtilsService } from './crypto-utils.service'
import { EncodeUtilsService } from './encode-utils.service'
import { ViemUtilsService } from './viem.utils.service'
import { DataUtilsService } from './data-utils.service'

@Module({
    providers: [
        CryptoUtilsService,
        EncodeUtilsService,
        ViemUtilsService,
        DataUtilsService,
    ],
    exports: [
        CryptoUtilsService,
        EncodeUtilsService,
        ViemUtilsService,
        DataUtilsService,
    ],
})
export class UtilsModule {}
