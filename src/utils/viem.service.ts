import { Injectable } from '@nestjs/common'
import { mainnet, sepolia, Chain } from 'viem/chains'

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
}
