import { Injectable } from '@nestjs/common'
import {
    AbstractProvider,
    JsonRpcProvider,
    Wallet,
    // getDefaultProvider,
} from 'ethers'

@Injectable()
export class WalletUtilsService {
    private provider: AbstractProvider

    constructor() {
        this.provider = new JsonRpcProvider(
            'https://ethereum-sepolia-rpc.publicnode.com'
        ) // getDefaultProvider('sepolia')
    }

    getSigner(privateKey: string) {
        const signer = new Wallet(privateKey, this.provider)
        return signer
    }

    getProvider() {
        return this.provider
    }
}
