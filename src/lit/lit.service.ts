import { Injectable, BadRequestException } from '@nestjs/common'
import {
    LitNodeClientNodeJs,
    encryptToJson,
} from '@lit-protocol/lit-node-client-nodejs'
import { ConfigService } from '@nestjs/config'
import { networkConfigs } from './constants/network.constants'
import {
    AccessControlConditions,
    EvmContractConditions,
} from '@lit-protocol/types'
import { PERMISSION_CONTRACTS } from '../shared/constants/chain.constants'
import { SupportedChainId, LitChain } from '../shared/types/chain.type'
import { LIT_CHAINS } from '@lit-protocol/constants'
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino'
import { Address, keccak256, toHex } from 'viem'

@Injectable()
export class LitService {
    private litNodeClient: LitNodeClientNodeJs = null
    constructor(
        private readonly configService: ConfigService,
        @InjectPinoLogger(LitService.name)
        private readonly logger: PinoLogger
    ) {}

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

    chainIdToLitChainName = (chainId: number): LitChain | undefined => {
        for (const [name, chain] of Object.entries(LIT_CHAINS)) {
            if (chain.chainId === chainId) {
                return name as LitChain
            }
        }
    }
    generateEvmContractConditions(
        chainId: SupportedChainId,
        id: Address
    ): EvmContractConditions {
        return [
            {
                contractAddress: PERMISSION_CONTRACTS[chainId].address,
                functionName:
                    PERMISSION_CONTRACTS[chainId].metadata
                        .permissionManagerFunctionName,
                functionParams: [keccak256(toHex(id)), ':userAddress'],
                functionAbi:
                    PERMISSION_CONTRACTS[chainId].metadata.permissionManagerAbi,
                chain: this.chainIdToLitChainName(chainId),
                returnValueTest: {
                    key: '',
                    comparator: '=',
                    value: 'true',
                },
            },
        ]
    }
    generateAccessControlConditions(
        chainId: SupportedChainId,
        value: Address
    ): AccessControlConditions {
        return [
            {
                contractAddress: '',
                standardContractType: '',
                chain: this.chainIdToLitChainName(chainId),
                method: '',
                parameters: [':userAddress'],
                returnValueTest: {
                    comparator: '=',
                    value,
                },
            },
        ]
    }

    async encrypt(
        chainId: SupportedChainId,
        dataToEncrypt: any,
        userAddress: Address
    ): Promise<string> {
        const evmContractConditions = this.generateEvmContractConditions(
            chainId,
            userAddress
        )
        const accessControlConditions = this.generateAccessControlConditions(
            chainId,
            userAddress
        )
        if (!this.litNodeClient) {
            await this.connect()
        }
        try {
            return await encryptToJson({
                string: JSON.stringify(dataToEncrypt),
                evmContractConditions,
                accessControlConditions,
                litNodeClient: this.litNodeClient,
                chain: this.chainIdToLitChainName(chainId),
            })
        } catch (error) {
            this.logger.error(error, `Failed to encrypt data`)
            throw new BadRequestException(`Failed to encrypt data`)
        }
    }
}
