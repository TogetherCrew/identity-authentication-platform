import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ViemUtilsService } from '../utils/viem.utils.service'
import {
    SCHEMA_TYPES,
    ATTEST_PRIMARY_TYPE,
} from './constants/attestation.constants'
import {
    getContract,
    Address,
    encodeAbiParameters,
    parseSignature,
    EncodeAbiParametersReturnType,
} from 'viem'
import { privateKeyToAccount, Account } from 'viem/accounts'
import { SUPPORTED_CHAINS } from '../constants/chain.constants'
import {
    IAttestationRequestData,
    IDelegatedAttestationRequest,
    IDelegatedAttestationMessage,
} from './interfaces/attestation.interfaces'
import {
    NO_EXPIRATION,
    ZERO_BYTES32,
} from '@ethereum-attestation-service/eas-sdk'
import { SupportedChainId } from '../types/chain.type'

@Injectable()
export class EasService {
    private attester: Account
    private easContracts: Map<number, any> = new Map()

    constructor(
        private readonly viemUtilsService: ViemUtilsService,
        private readonly configService: ConfigService
    ) {
        this.attester = privateKeyToAccount(
            this.configService.get<string>('wallet.privateKey') as '0x${string}'
        )
        this.setEasContracts()
    }
    private setEasContracts() {
        for (const chain of SUPPORTED_CHAINS) {
            const publicClient = this.viemUtilsService.getPublicClient(
                chain.chainId
            )
            if (publicClient) {
                const easContract = getContract({
                    address: chain.easContractAddress as '0x${string}',
                    abi: chain.easContractAbi,
                    client: publicClient,
                })
                this.easContracts.set(chain.chainId, easContract)
            }
        }
    }

    getContract(chainId: SupportedChainId) {
        return this.easContracts.get(chainId)
    }

    getSchemaUUID(chainId: SupportedChainId): '0x${string}' {
        const chain = SUPPORTED_CHAINS.find(
            (chain) => chain.chainId === chainId
        )
        if (!chain) {
            throw new Error(`Unsupported chain ID: ${chainId}`)
        }
        return chain.easSchemaUUID as '0x${string}'
    }
    getContractAddress(chainId: SupportedChainId): '0x${string}' {
        const chain = SUPPORTED_CHAINS.find(
            (chain) => chain.chainId === chainId
        )
        if (!chain) {
            throw new Error(`Unsupported chain ID: ${chainId}`)
        }
        return chain.easContractAddress as '0x${string}'
    }
    getContractABI(chainId: SupportedChainId) {
        const chain = SUPPORTED_CHAINS.find(
            (chain) => chain.chainId === chainId
        )
        if (!chain) {
            throw new Error(`Unsupported chain ID: ${chainId}`)
        }
        return chain.easContractAbi
    }

    async getDomain(chainId: SupportedChainId) {
        const eas = await this.getContract(chainId)
        if (!eas) {
            throw new Error(`EAS contract not found for chain ID: ${chainId}`)
        }
        return {
            name: 'EAS',
            version: await eas.read.VERSION(),
            chainId,
            verifyingContract: eas.address,
        }
    }

    async getNounce(chainId: SupportedChainId) {
        const eas = await this.getContract(chainId)
        if (!eas) {
            throw new Error(`EAS contract not found for chain ID: ${chainId}`)
        }
        return await eas.read.getNonce([this.attester.address])
    }

    createAttestationRequestData(
        data: EncodeAbiParametersReturnType,
        recipient: Address
    ): IAttestationRequestData {
        const requestData: IAttestationRequestData = {
            data,
            recipient,
            expirationTime: NO_EXPIRATION,
            refUID: ZERO_BYTES32,
            revocable: true,
            value: NO_EXPIRATION,
        }
        return requestData
    }

    createDelegatedAttestationRequest(
        requestData: IAttestationRequestData,
        chainId: SupportedChainId,
        signature: '0x${string}'
    ): IDelegatedAttestationRequest {
        const { r, s, v } = parseSignature(signature)
        const request: IDelegatedAttestationRequest = {
            signature: { r, s, v: Number(v) },
            attester: this.attester.address,
            schema: this.getSchemaUUID(chainId),
            data: requestData,
            deadline: 0n,
        }
        return request
    }
    createAttestationMessage(
        requestData: IAttestationRequestData,
        chainId: SupportedChainId,
        nonce: any
    ): IDelegatedAttestationMessage {
        const message: IDelegatedAttestationMessage = {
            ...requestData,
            schema: this.getSchemaUUID(chainId),
            attester: this.attester.address,
            deadline: NO_EXPIRATION,
            nonce,
        }
        return message
    }

    async signAttestationMessage(
        message: IDelegatedAttestationMessage,
        domain: any
    ) {
        const signature = await this.attester.signTypedData({
            domain,
            types: {
                // TODO: Use ATTEST_TYPE
                Attest: [
                    { name: 'attester', type: 'address' },
                    { name: 'schema', type: 'bytes32' },
                    { name: 'recipient', type: 'address' },
                    { name: 'expirationTime', type: 'uint64' },
                    { name: 'revocable', type: 'bool' },
                    { name: 'refUID', type: 'bytes32' },
                    { name: 'data', type: 'bytes' },
                    { name: 'value', type: 'uint256' },
                    { name: 'nonce', type: 'uint256' },
                    { name: 'deadline', type: 'uint64' },
                ],
            },
            primaryType: ATTEST_PRIMARY_TYPE,
            message,
        })
        return signature
    }
    async getDelegatedAttestationRequest(
        chainId: SupportedChainId,
        params,
        recipient: Address
    ) {
        const domain = await this.getDomain(chainId)
        const nonce = await this.getNounce(chainId)
        const data = encodeAbiParameters(SCHEMA_TYPES, params)
        const attestationRequestData = this.createAttestationRequestData(
            data,
            recipient
        )
        const attestationMessage = this.createAttestationMessage(
            attestationRequestData,
            chainId,
            nonce
        )
        const signature = await this.signAttestationMessage(
            attestationMessage,
            domain
        )
        return this.createDelegatedAttestationRequest(
            attestationRequestData,
            chainId,
            signature as '0x${string}'
        )
    }
}
