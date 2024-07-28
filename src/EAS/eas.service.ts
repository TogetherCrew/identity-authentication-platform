import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ViemService } from '../utils/viem.service'
import {
    EAS_SEPOLIA_CONTRACT_ABI,
    EAS_SEPOLIA_CONTRACT_ADDRESS,
} from './constants/sepolia'
import {
    http,
    getContract,
    Client,
    createPublicClient,
    createWalletClient,
    encodeAbiParameters,
    EncodeAbiParametersReturnType,
} from 'viem'
import { privateKeyToAccount, Account } from 'viem/accounts'

privateKeyToAccount

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

    setPublicClient(chainName: string) {
        const chain = this.viemService.stringToChain(chainName)
        this.publicClient = createPublicClient({
            chain,
            transport: http(),
        })
    }
    setWalletClient(chainName: string) {
        const chain = this.viemService.stringToChain(chainName)
        this.walletClient = createWalletClient({
            account: this.attester,
            chain,
            transport: http(),
        })
    }
    setEas() {
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

    getEncodeAbiParameters(
        types: Array<object>,
        params: never
    ): EncodeAbiParametersReturnType {
        return encodeAbiParameters(types, params)
    }

    async getSignatureFromSignTypeData(
        domain: object,
        types: Record<string, unknown>,
        primaryType: string,
        message: Record<string, unknown>
    ) {
        await this.attester.signTypedData({
            domain,
            types,
            primaryType,
            message,
        })
    }
}
