import { Injectable } from '@nestjs/common'
// import { ConfigService } from '@nestjs/config'
// import { EAS } from '@ethereum-attestation-service/eas-sdk'
// import { ViemService } from 'src/utils/viem.service'
import {
    EAS_SEPOLIA_CONTRACT_ABI,
    EAS_SEPOLIA_CONTRACT_ADDRESS,
} from './constants/sepolia'
import { Client, createPublicClient, getContract, http } from 'viem'
import { sepolia } from 'viem/chains'
// import {
//     EAS_SEPOLIA_CONTRACT_ADDRESS,
//     EAS_SEPOLIA_CONTRACT_ABI,
// } from './constants/sepolia'
@Injectable()
export class EasService {
    public readonly eas: any
    private signer: any

    constructor() {
        // private readonly viemService: ViemService // private readonly configService: ConfigService,
        // const publicClient: Client = viemService.getPublicClient()
        const publicClient = createPublicClient({
            chain: sepolia,
            transport: http(),
        })

        this.eas = getContract({
            address: EAS_SEPOLIA_CONTRACT_ADDRESS,
            abi: EAS_SEPOLIA_CONTRACT_ABI,
            client: publicClient as Client<any, any, any>,
        })

        // const chain = viemService.stringToChain('sepolia')
        // const transport = viemService.getTransportByChain(chain)
        // const publicClient = viemService.getPublicClient(chain, transport)
        // const eas = viemService.getContractByClient(
        //     EAS_SEPOLIA_CONTRACT_ADDRESS,
        //     EAS_SEPOLIA_CONTRACT_ABI,
        //     publicClient
        // )
    }

    async getDomain() {
        const domain = {
            name: 'EAS',
            version: await this.eas.read.VERSION(),
            chainId: sepolia.id, // TODO: publicClient.getChainId()
            verifyingContract: this.eas.address,
        }
        return domain
    }
}
