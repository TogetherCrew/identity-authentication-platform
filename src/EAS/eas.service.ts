import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EAS } from '@ethereum-attestation-service/eas-sdk'
import { ViemService } from 'src/utils/viem.service'
// import {
//     EAS_SEPOLIA_CONTRACT_ADDRESS,
//     EAS_SEPOLIA_CONTRACT_ABI,
// } from './constants/sepolia'
@Injectable()
export class EasService {
    private readonly eas: EAS
    private signer: any

    constructor(
        private readonly configService: ConfigService,
        private readonly viemService: ViemService
    ) {
        // const chain = viemService.stringToChain('sepolia')
        // const transport = viemService.getTransportByChain(chain)
        // const publicClient = viemService.getPublicClient(chain, transport)
        // const eas = viemService.getContractByClient(
        //     EAS_SEPOLIA_CONTRACT_ADDRESS,
        //     EAS_SEPOLIA_CONTRACT_ABI,
        //     publicClient
        // )
    }
}
