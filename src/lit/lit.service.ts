import { Injectable, InternalServerErrorException } from '@nestjs/common'
import {
    LitNodeClientNodeJs,
    encryptToJson,
    decryptFromJson,
} from '@lit-protocol/lit-node-client-nodejs'
import { ConfigService } from '@nestjs/config'
import { networks } from './constants/network.constants'
import {
    AccessControlConditions,
    EvmContractConditions,
} from '@lit-protocol/types'
import { PERMISSION_CONTRACTS } from '../shared/constants/chain.constants'
import { SupportedChainId, LitChain } from '../shared/types/chain.type'
import { LIT_CHAINS } from '@lit-protocol/constants'
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino'
import { Address, keccak256, toHex } from 'viem'
import { EthersUtilsService } from '../utils/ethers.utils.service'
import { LitNetwork } from '@lit-protocol/constants'
import {
    LitAbility,
    LitAccessControlConditionResource,
    createSiweMessage,
    generateAuthSig,
} from '@lit-protocol/auth-helpers'
import { privateKeyToAddress } from 'viem/accounts'

@Injectable()
export class LitService {
    private litNodeClient: LitNodeClientNodeJs = null
    private networkName: LitNetwork
    constructor(
        private readonly configService: ConfigService,
        private readonly ethersUtilsService: EthersUtilsService,

        @InjectPinoLogger(LitService.name)
        private readonly logger: PinoLogger
    ) {}

    async connect() {
        this.networkName = this.configService.get<string>(
            'lit.network'
        ) as LitNetwork
        this.litNodeClient = new LitNodeClientNodeJs(
            networks[this.networkName].clientConfig
        )
        await this.litNodeClient.connect()
    }

    async disconnect() {
        await this.litNodeClient.disconnect()
        this.litNodeClient = null
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
        userAddress: Address
    ): EvmContractConditions {
        return [
            {
                contractAddress: PERMISSION_CONTRACTS[chainId].address,
                functionName:
                    PERMISSION_CONTRACTS[chainId].metadata
                        .hasPermissionFunctionName,
                functionParams: [keccak256(toHex(userAddress)), ':userAddress'],
                functionAbi:
                    PERMISSION_CONTRACTS[chainId].metadata.hasPermissionAbi,
                chain: this.chainIdToLitChainName(chainId),
                returnValueTest: {
                    key: '',
                    comparator: '=',
                    value: 'true',
                },
            },
            { operator: 'or' },
            // {
            //     contractAddress: ACCESS_MANAGER_CONTRACTS[chainId].address,
            //     functionName:
            //         ACCESS_MANAGER_CONTRACTS[chainId].metadata
            //             .hasRoleFunctionName,
            //     functionParams: [
            //         '3',
            //         privateKeyToAddress(
            //             this.configService.get<string>(
            //                 'wallet.privateKey'
            //             ) as '0x${string}'
            //         ),
            //     ],
            //     functionAbi:
            //         ACCESS_MANAGER_CONTRACTS[chainId].metadata.hasRoleAbi,
            //     chain: this.chainIdToLitChainName(chainId),
            //     returnValueTest: {
            //         key: '',
            //         comparator: '=',
            //         value: 'true',
            //     },
            // },
            {
                contractAddress: '0x946F4b6EA3AD07Cd4eed93D1baD54Ac2c948e0C0',
                functionName: 'hasRole',
                functionParams: [
                    '3',
                    privateKeyToAddress(
                        this.configService.get<string>(
                            'wallet.privateKey'
                        ) as '0x${string}'
                    ),
                ],
                functionAbi: {
                    inputs: [
                        {
                            internalType: 'uint64',
                            name: 'roleId',
                            type: 'uint64',
                        },
                        {
                            internalType: 'address',
                            name: 'account',
                            type: 'address',
                        },
                    ],
                    name: 'hasRole',
                    outputs: [
                        {
                            internalType: 'bool',
                            name: 'isMember',
                            type: 'bool',
                        },
                        {
                            internalType: 'uint32',
                            name: 'executionDelay',
                            type: 'uint32',
                        },
                    ],
                    stateMutability: 'view',
                    type: 'function',
                },
                chain: this.chainIdToLitChainName(chainId),
                returnValueTest: {
                    key: 'isMember',
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
            { operator: 'or' },
            {
                contractAddress: '',
                standardContractType: '',
                chain: this.chainIdToLitChainName(chainId),
                method: '',
                parameters: [':userAddress'],
                returnValueTest: {
                    comparator: '=',
                    value: privateKeyToAddress(
                        this.configService.get<string>(
                            'wallet.privateKey'
                        ) as '0x${string}'
                    ),
                },
            },
        ]
    }
    async getSessionSigsViaAuthSig(chainId: SupportedChainId) {
        const signer = this.ethersUtilsService.getSigner(
            networks[this.networkName].rpc,
            this.configService.get<string>('wallet.privateKey')
        )
        if (!this.litNodeClient) {
            await this.connect()
        }
        const expiration = new Date(
            Date.now() + 1000 * 60 * 60 * 24
        ).toISOString()

        const resourceAbilityRequests = [
            {
                resource: new LitAccessControlConditionResource('*'),
                ability: LitAbility.AccessControlConditionDecryption,
            },
        ]

        const authNeededCallback = async (params: {
            uri?: string
            expiration?: string
            resourceAbilityRequests?: any
        }) => {
            const toSign = await createSiweMessage({
                uri: params.uri!,
                expiration: params.expiration!,
                resources: params.resourceAbilityRequests,
                walletAddress: await signer.getAddress(),
                nonce: await this.litNodeClient!.getLatestBlockhash(),
                litNodeClient: this.litNodeClient,
            })

            return await generateAuthSig({
                signer: signer,
                toSign,
            })
        }

        return await this.litNodeClient.getSessionSigs({
            chain: this.chainIdToLitChainName(chainId),
            expiration,
            resourceAbilityRequests,
            authNeededCallback,
        })
    }

    async decryptFromJson(chainId: SupportedChainId, dataToDecrypt: any) {
        if (!this.litNodeClient) {
            await this.connect()
        }
        const sessionSigs = await this.getSessionSigsViaAuthSig(chainId)
        try {
            return await decryptFromJson({
                litNodeClient: this.litNodeClient,
                parsedJsonData: JSON.parse(dataToDecrypt),
                sessionSigs,
            })
        } catch (error) {
            this.logger.error(error, `Failed to decrypt data`)
            throw new InternalServerErrorException(`Failed to decrypt data`)
        }
    }

    async encryptToJson(
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
            throw new InternalServerErrorException(`Failed to encrypt data`)
        }
    }
}
