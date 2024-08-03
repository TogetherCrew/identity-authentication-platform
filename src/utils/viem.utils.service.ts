import { Injectable } from '@nestjs/common'
import { SUPPORTED_CHAIN_IDS } from '../constants/chain.constants'
import { SupportedChainId } from '../types/chain.type'
import { createPublicClient, http, Client } from 'viem'
import * as chains from 'viem/chains'
@Injectable()
export class ViemUtilsService {
    private publicClients: Map<number, any>

    constructor() {
        this.publicClients = new Map<number, Client<any, any, any>>()
        this.setPublicClients()
    }

    private setPublicClients() {
        for (const chainId of SUPPORTED_CHAIN_IDS) {
            const chain = this.idToChain(chainId)
            if (chain) {
                const client = createPublicClient({
                    chain,
                    transport: http(),
                })
                this.publicClients.set(chainId, client)
            }
        }
    }

    getPublicClient(chainId: SupportedChainId) {
        return this.publicClients.get(chainId)
    }

    idToChain(chainId: SupportedChainId) {
        for (const chain of Object.values(chains)) {
            if ('id' in chain) {
                if (chain.id === chainId) {
                    return chain
                }
            }
        }
    }
}
