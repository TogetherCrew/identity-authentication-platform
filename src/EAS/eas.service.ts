import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ViemService } from '../utils/viem.service'
import {
    EAS_SEPOLIA_CONTRACT_ABI,
    EAS_SEPOLIA_CONTRACT_ADDRESS,
} from './constants/sepolia.constants'
// import { SCHEMA_TYPES } from './constants/attestation.constants'
import {
    http,
    getContract,
    Client,
    createPublicClient,
    createWalletClient,
    Chain,
    Address,
} from 'viem'
import { privateKeyToAccount, Account } from 'viem/accounts'
// import {
//     IAttestationRequestData,
//     IDelegatedAttestationRequest,
//     IDelegatedAttestationMessage,
// } from './interfaces/attestation.interfaces'
// import {
//     NO_EXPIRATION,
//     ZERO_BYTES32,
// } from '@ethereum-attestation-service/eas-sdk'
@Injectable()
export class EasService {
    private eas: any
    private publicClient: any
    private walletClient: any
    private attester: Account
    constructor(
        private readonly viemService: ViemService,
        private readonly configService: ConfigService
    ) {
        this.attester = privateKeyToAccount(
            this.configService.get<string>('wallet.privateKey') as '0x${string}'
        )
    }

    async setPublicClient(chain: Chain) {
        this.publicClient = createPublicClient({
            chain,
            transport: http(),
        })
    }
    async setWalletClient(chain: Chain) {
        this.walletClient = createWalletClient({
            account: this.attester,
            chain,
            transport: http(),
        })
    }
    async setEas() {
        this.eas = getContract({
            address: EAS_SEPOLIA_CONTRACT_ADDRESS,
            abi: EAS_SEPOLIA_CONTRACT_ABI,
            client: this.publicClient as Client<any, any, any>,
        })
    }
    async getDomain() {
        return {
            name: 'EAS',
            version: await this.eas.read.VERSION(),
            chainId: this.publicClient.getChainId(),
            verifyingContract: this.eas.address,
        }
    }

    async getNounce() {
        return await this.eas.read.getNonce([this.attester.address])
    }

    async getDelegatedAttestationRequest(
        chainId: number,
        params,
        recipient: Address
    ) {
        const chain = await this.viemService.idToChain(chainId)
        await this.setPublicClient(chain)
        await this.setEas()
        console.log(chainId, params, recipient)
        // const domain = await this.getDomain()
        // const nonce = await this.getNounce()
        // const data = encodeAbiParameters(SCHEMA_TYPES, params)
        // const requestData: IAttestationRequestData = {
        //     data,
        //     recipient,
        //     expirationTime: NO_EXPIRATION,
        //     refUID: ZERO_BYTES32,
        //     revocable: true,
        //     value: NO_EXPIRATION,
        // }
        // const message: IDelegatedAttestationMessage = {
        //     ...requestData,
        //     schema: SCHEMA_UUID,
        //     attester: this.attester.address,
        //     deadline: NO_EXPIRATION,
        //     nonce,
        // }
        // const signature = await this.attester.signTypedData({
        //     domain,
        //     types: {
        //         Attest: [
        //             { name: 'attester', type: 'address' },
        //             { name: 'schema', type: 'bytes32' },
        //             { name: 'recipient', type: 'address' },
        //             { name: 'expirationTime', type: 'uint64' },
        //             { name: 'revocable', type: 'bool' },
        //             { name: 'refUID', type: 'bytes32' },
        //             { name: 'data', type: 'bytes' },
        //             { name: 'value', type: 'uint256' },
        //             { name: 'nonce', type: 'uint256' },
        //             { name: 'deadline', type: 'uint64' },
        //         ],
        //     },
        //     primaryType: 'Attest',
        //     message,
        // })

        // const { r, s, v } = parseSignature(signature)
        // const request: IDelegatedAttestationRequest = {
        //     signature: { r, s, v: Number(v) },
        //     attester: this.attester.address,
        //     schema: SCHEMA_UUID,
        //     data: requestData,
        //     deadline: 0n,
        // }

        // return request
    }
}
