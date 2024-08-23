import { Injectable, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SCHEMA_TYPES } from './constants/attestation.constants'
import {
    EAS_CONTRACTS,
    SUPPORTED_CHAINS,
    CHAINS,
} from '../shared/constants/chain.constants'
import { SupportedChainId } from '../shared/types/chain.type'
import { Signer } from 'ethers'
import { EthersUtilsService } from '../utils/ethers.utils.service'
import {
    EAS,
    SchemaEncoder,
    NO_EXPIRATION,
    ZERO_BYTES32,
} from '@ethereum-attestation-service/eas-sdk'
import { Address } from 'viem'
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino'

@Injectable()
export class EasService {
    private attesters: Map<number, Signer> = new Map()
    private contracts: Map<number, EAS> = new Map()

    constructor(
        private readonly ethersUtilsService: EthersUtilsService,
        private readonly configService: ConfigService,
        @InjectPinoLogger(EasService.name)
        private readonly logger: PinoLogger
    ) {
        this.setAttesters()
        this.setContracts()
    }

    private setAttesters() {
        const privateKey = this.configService.get<string>(
            'wallet.privateKey'
        ) as string
        for (const chainId of SUPPORTED_CHAINS) {
            this.attesters.set(
                chainId,
                this.ethersUtilsService.getSigner(
                    CHAINS[chainId].rpcURL,
                    privateKey
                )
            )
        }
    }

    private setContracts(): void {
        for (const chainId of SUPPORTED_CHAINS) {
            const eas = new EAS(EAS_CONTRACTS[chainId].address)
            const attester = this.getAttester(chainId)
            eas.connect(attester)
            this.contracts.set(chainId, eas)
        }
    }

    getContract(chainId: SupportedChainId): EAS {
        return this.contracts.get(chainId)
    }

    getAttester(chainId: SupportedChainId): Signer {
        return this.attesters.get(chainId)
    }

    private encodeAttestationData(params: any[]): string {
        const schemaEncoder = new SchemaEncoder(SCHEMA_TYPES)
        return schemaEncoder.encodeData([
            { name: 'key', value: params[0], type: 'bytes32' },
            { name: 'provider', value: params[1], type: 'string' },
            { name: 'secret', value: params[2], type: 'string' },
        ])
    }

    private buildAttestationPayload(
        chainId: SupportedChainId,
        encodedData: string,
        recipient: Address
    ) {
        return {
            schema: EAS_CONTRACTS[chainId].metadata.schema,
            recipient,
            expirationTime: NO_EXPIRATION,
            revocable: true,
            refUID: ZERO_BYTES32,
            data: encodedData,
            deadline: 0n,
            value: 0n,
        }
    }

    async getSignedDelegatedAttestation(
        chainId: SupportedChainId,
        params: any[],
        recipient: Address
    ) {
        try {
            const eas = this.getContract(chainId)
            const encodedData = this.encodeAttestationData(params)
            const attestationPayload = this.buildAttestationPayload(
                chainId,
                encodedData,
                recipient
            )
            const delegated = await eas.getDelegated()
            const attester = this.getAttester(chainId)

            return await delegated.signDelegatedAttestation(
                attestationPayload,
                attester
            )
        } catch (error) {
            this.logger.error(error, 'Faield to signed delegated attestation')
            throw new BadRequestException(
                `Faield to signed delegated attestation`
            )
        }
    }

    async getSignedDelegatedRevocation(chainId: SupportedChainId, uid: string) {
        try {
            const eas = this.getContract(chainId)
            const delegated = await eas.getDelegated()
            const attester = this.getAttester(chainId)

            return await delegated.signDelegatedRevocation(
                {
                    schema: EAS_CONTRACTS[chainId].metadata.schema,
                    uid,
                    deadline: 0n,
                    value: 0n,
                },
                attester
            )
        } catch (error) {
            this.logger.error(error, 'Faield to signed delegated revocation')
            throw new BadRequestException(
                `Faield to signed delegated revocation`
            )
        }
    }
}
