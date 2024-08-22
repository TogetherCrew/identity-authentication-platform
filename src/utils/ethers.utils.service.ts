import { Injectable } from '@nestjs/common'
import { AbstractProvider, JsonRpcProvider, Wallet, Signer } from 'ethers'
import { SUPPORTED_CHAINS, CHAINS } from '../shared/constants/chain.constants'
import { SupportedChainId } from '../shared/types/chain.type'

@Injectable()
export class EthersUtilsService {
    private providers: Map<number, AbstractProvider> = new Map()
    constructor() {
        this.setProviders()
    }

    private setProviders() {
        {
            for (const chainId of SUPPORTED_CHAINS) {
                const provider = new JsonRpcProvider(CHAINS[chainId].rpcURL)
                this.providers.set(chainId, provider)
            }
        }
    }

    getSigner(chainId: SupportedChainId, privateKey: string): Signer {
        return new Wallet(privateKey, this.getProvider(chainId))
    }

    getProvider(chainId: SupportedChainId) {
        return this.providers.get(chainId)
    }
}
