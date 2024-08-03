import {
    Injectable,
    Logger,
    InternalServerErrorException,
} from '@nestjs/common'
import {
    LitNodeClientNodeJs,
    encryptToJson,
} from '@lit-protocol/lit-node-client-nodejs'
import { ConfigService } from '@nestjs/config'
import { networkConfigs } from './constants/network.constants'
import { EvmContractConditions } from '@lit-protocol/types'
import { SUPPORTED_CHAINS } from '../constants/chain.constants'
import { SupportedChainId, LitChain } from '../types/chain.type'
import { LIT_CHAINS } from '@lit-protocol/constants'

@Injectable()
export class LitService {
    private readonly logger = new Logger(LitService.name)
    private litNodeClient: LitNodeClientNodeJs = null
    constructor(private readonly configService: ConfigService) {}

    async connect() {
        const networkConfig = this.getNetworkConfig(
            this.configService.get<string>('lit.network')
        )
        this.litNodeClient = new LitNodeClientNodeJs(networkConfig)
        await this.litNodeClient.connect()
    }

    async disconnect() {
        await this.litNodeClient.disconnect()
        this.litNodeClient = null
    }

    getNetworkConfig(networkName: string) {
        const networkConfig = networkConfigs.find(
            (network) => network.litNetwork === networkName
        )
        if (!networkConfig) {
            throw new Error(`Unsupported lit network: ${networkName}`)
        }
        return networkConfig
    }

    getContractAddress(chainId: SupportedChainId): '0x${string}' {
        const chain = SUPPORTED_CHAINS.find(
            (chain) => chain.chainId === chainId
        )
        if (!chain) {
            throw new Error(`Unsupported chain ID: ${chainId}`)
        }
        return chain.permissionManagerContractAddress as '0x${string}'
    }

    getContractFunctionName(chainId: SupportedChainId) {
        const chain = SUPPORTED_CHAINS.find(
            (chain) => chain.chainId === chainId
        )
        if (!chain) {
            throw new Error(`Unsupported chain ID: ${chainId}`)
        }
        return chain.permissionManagerContractFunctionName
    }

    getContractAbi(chainId: SupportedChainId) {
        const chain = SUPPORTED_CHAINS.find(
            (chain) => chain.chainId === chainId
        )
        if (!chain) {
            throw new Error(`Unsupported chain ID: ${chainId}`)
        }
        return chain.permissionManagerContractAbi
    }

    chainIdToLitChainName = (chainId: number): LitChain | undefined => {
        for (const [name, chain] of Object.entries(LIT_CHAINS)) {
            if (chain.chainId === chainId) {
                return name as LitChain
            }
        }
    }
    generateEvmContractConditions(
        chainId: SupportedChainId
    ): EvmContractConditions {
        return [
            {
                contractAddress: this.getContractAddress(chainId),
                functionName: this.getContractFunctionName(chainId),
                functionParams: ['name', ':userAddress'],
                functionAbi: this.getContractAbi(chainId),
                chain: this.chainIdToLitChainName(chainId),
                returnValueTest: {
                    key: '',
                    comparator: '=',
                    value: 'true',
                },
            },
        ]
    }

    async encrypt(
        chainId: SupportedChainId,
        dataToEncrypt: any
    ): Promise<void> {
        const evmContractConditions =
            this.generateEvmContractConditions(chainId)
        if (!this.litNodeClient) {
            await this.connect()
        }
        try {
            const encryptResponse = await encryptToJson({
                string: JSON.stringify(dataToEncrypt),
                evmContractConditions,
                litNodeClient: this.litNodeClient,
                chain: this.chainIdToLitChainName(chainId),
            })
            this.logger.log(encryptResponse)
        } catch (error) {
            this.logger.error(`Failed to encrypt data`, error)
            throw new InternalServerErrorException(`Failed to encrypt data`)
        }
    }
}
