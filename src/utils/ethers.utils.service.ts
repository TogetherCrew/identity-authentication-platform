import { Injectable } from '@nestjs/common'
import { JsonRpcProvider, Wallet, Signer } from 'ethers'

@Injectable()
export class EthersUtilsService {
    getProvider(rpcURL: string) {
        return new JsonRpcProvider(rpcURL)
    }

    getSigner(rpcURL: string, privateKey: string): Signer {
        return new Wallet(privateKey, this.getProvider(rpcURL))
    }
}
