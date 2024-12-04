import {
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
    HttpStatus,
} from '@nestjs/common'
import {
    LitNodeClientNodeJs,
    encryptToJson,
    decryptFromJson,
} from '@lit-protocol/lit-node-client-nodejs'
import { ConfigService } from '@nestjs/config'
import { networks } from './constants/network.constants'
import { UnifiedAccessControlConditions } from '@lit-protocol/types'
import {
    PERMISSION_CONTRACTS,
    ACCESS_MANAGER_CONTRACTS,
} from '../shared/constants/chain.constants'
import { SupportedChainId, LitChain } from '../shared/types/chain.type'
import { LIT_CHAINS } from '@lit-protocol/constants'
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino'
import { Address } from 'viem'
import { EthersUtilsService } from '../utils/ethers.utils.service'
import { LitNetwork } from '@lit-protocol/constants'
import {
    LitAbility,
    LitAccessControlConditionResource,
    createSiweMessage,
    generateAuthSig,
} from '@lit-protocol/auth-helpers'

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
    generateunifiedAccessControlConditions(
        chainId: SupportedChainId,
        key: Address,
        userAddress: Address
    ): UnifiedAccessControlConditions {
        return [
            {
                conditionType: 'evmBasic',
                contractAddress: '',
                standardContractType: '',
                chain: this.chainIdToLitChainName(chainId),
                method: '',
                parameters: [':userAddress'],
                returnValueTest: {
                    comparator: '=',
                    value: userAddress,
                },
            },
            { operator: 'or' },
            {
                conditionType: 'evmContract',
                contractAddress: PERMISSION_CONTRACTS[chainId].address,
                functionName:
                    PERMISSION_CONTRACTS[chainId].metadata
                        .hasPermissionFunctionName,
                functionParams: [key, ':userAddress'],
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
            {
                conditionType: 'evmContract',
                contractAddress: ACCESS_MANAGER_CONTRACTS[chainId].address,
                functionName:
                    ACCESS_MANAGER_CONTRACTS[chainId].metadata
                        .hasRoleFunctionName,
                functionParams: [
                    ACCESS_MANAGER_CONTRACTS[chainId].metadata.HasRoleRoleId,
                    ':userAddress',
                ],
                functionAbi:
                    ACCESS_MANAGER_CONTRACTS[chainId].metadata.hasRoleAbi,
                chain: this.chainIdToLitChainName(chainId),
                returnValueTest: {
                    key: 'isMember',
                    comparator: '=',
                    value: 'true',
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
            if (error.status === HttpStatus.UNAUTHORIZED) {
                throw new UnauthorizedException(error.message)
            } else {
                throw new InternalServerErrorException('Failed to decrypt data')
            }
        }
    }

    async encryptToJson(
        chainId: SupportedChainId,
        dataToEncrypt: any,
        key: Address,
        userAddress: Address
    ): Promise<string> {
        if (!this.litNodeClient) {
            await this.connect()
        }
        try {
            return await encryptToJson({
                string: JSON.stringify(dataToEncrypt),
                litNodeClient: this.litNodeClient,
                unifiedAccessControlConditions:
                    this.generateunifiedAccessControlConditions(
                        chainId,
                        key,
                        userAddress
                    ),
                chain: this.chainIdToLitChainName(chainId),
            })
        } catch (error) {
            this.logger.error(error, `Failed to encrypt data`)
            throw new InternalServerErrorException(`Failed to encrypt data`)
        }
    }
}
