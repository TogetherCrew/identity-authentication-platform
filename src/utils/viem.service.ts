import { Injectable } from '@nestjs/common'
import { mainnet, sepolia, Chain } from 'viem/chains'
import * as chains from 'viem/chains'

@Injectable()
export class ViemService {
    constructor() {}

    stringToChain(chainString: string): Chain {
        switch (chainString) {
            case 'mainnet':
                return mainnet
            case 'sepolia':
                return sepolia
            default:
                return null
        }
    }

    idToChain(chainId: number) {
        for (const chain of Object.values(chains)) {
            if ('id' in chain) {
                if (chain.id === chainId) {
                    return chain
                }
            }
        }
    }
}
