import { Injectable } from '@nestjs/common'
import {
    Transport,
    http,
    Address,
    Abi,
    getContract,
    WalletClient,
    Client,
    createPublicClient,
    createWalletClient,
} from 'viem'
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

    getTransportByChain(chain: Chain): Transport {
        switch (chain) {
            case mainnet:
                return http('https://rpc.payload.de')
            case sepolia:
                return http('https://eth-sepolia.api.onfinality.io/public')
            default:
                return null
        }
    }

    getWalletClient(chain: Chain, transport: Transport): WalletClient {
        return createWalletClient({
            chain,
            transport,
        })
    }

    getPublicClient(chain: Chain, transport: Transport) {
        return createPublicClient({
            chain,
            transport,
        })
    }

    getContractByClient(
        address: Address,
        abi: Abi,
        client: Client | { public: Client; wallet: Client }
    ) {
        return getContract({
            address,
            abi,
            client,
        })
    }
}
