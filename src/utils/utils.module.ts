import { Module } from '@nestjs/common'
import { CryptoUtilsService } from './crypto-utils.service'
import { EncodeUtilsService } from './encode-utils.service'
import { ViemUtilsService } from './viem.utils.service'
import { DataUtilsService } from './data-utils.service'
import { WalletUtilsService } from './wallet.utils.service'

@Module({
    providers: [
        CryptoUtilsService,
        EncodeUtilsService,
        ViemUtilsService,
        DataUtilsService,
        WalletUtilsService,
    ],
    exports: [
        CryptoUtilsService,
        EncodeUtilsService,
        ViemUtilsService,
        DataUtilsService,
        WalletUtilsService,
    ],
})
export class UtilsModule { }
