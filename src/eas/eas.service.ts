import {
    Injectable,
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common'
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
    Attestation,
    SchemaDecodedItem,
} from '@ethereum-attestation-service/eas-sdk'
import { AuthService } from '../auth/auth.service'
import { LitService } from '../lit/lit.service'
import { DataUtilsService } from '../utils/data-utils.service'
import { Address } from 'viem'
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino'
import { privateKeyToAddress } from 'viem/accounts'
import { SignDelegatedAttestationDto } from './dto/sign-delegated-attestation.dto'
import { SignDelegatedRevocationDto } from './dto/sign-delegated-revocation.dto'
import { DecryptAttestationSecretDto } from './dto/decrypt-attestation-secret.dto'
import { keccak256, toHex } from 'viem'

@Injectable()
export class EasService {
    private attesters: Map<number, Signer> = new Map()
    private contracts: Map<number, EAS> = new Map()

    constructor(
        private readonly authService: AuthService,
        private readonly litService: LitService,
        private readonly dataUtilsService: DataUtilsService,
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
        ) as '0x${string}'
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
    encodeAttestationData(params: any[]): string {
        const schemaEncoder = new SchemaEncoder(SCHEMA_TYPES)
        return schemaEncoder.encodeData([
            { name: 'key', value: params[0], type: 'bytes32' },
            { name: 'provider', value: params[1], type: 'string' },
            { name: 'secret', value: params[2], type: 'string' },
        ])
    }

    decodeAttestationData(data: string): SchemaDecodedItem[] {
        const schemaEncoder = new SchemaEncoder(SCHEMA_TYPES)
        return schemaEncoder.decodeData(data)
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

    checkAttestar(attestation: Attestation, attester: Address) {
        if (attestation.attester !== attester) {
            throw new BadRequestException(
                `We aren't attester of this attesation`
            )
        }
    }
    checkRecipient(attestation: Attestation, recipient: Address) {
        if (attestation.recipient !== recipient) {
            throw new ForbiddenException(
                `You aren't recipient of this attesation`
            )
        }
    }
    async getAttestaion(chainId: SupportedChainId, uid: string) {
        try {
            const eas = this.getContract(chainId)
            return await eas.getAttestation(uid)
        } catch (error) {
            this.logger.error(error, "Attestation didn't find")
            throw new NotFoundException("Attestation didn't find")
        }
    }

    async getSignedDelegatedAttestation(
        signDelegatedAttestationDto: SignDelegatedAttestationDto
    ) {
        try {
            const { chainId, anyJwt, siweJwt } = signDelegatedAttestationDto
            const siweJwtPayload = await this.authService.validateToken(siweJwt)
            const anyJwtPayload = await this.authService.validateToken(anyJwt)
            const secret = await this.litService.encryptToJson(
                chainId,
                {
                    id: anyJwtPayload.sub,
                    provider: anyJwtPayload.provider,
                },
                siweJwtPayload.sub as '0x${string}'
            )
            const eas = this.getContract(chainId)
            const encodedData = this.encodeAttestationData([
                keccak256(toHex(anyJwtPayload.sub)),
                anyJwtPayload.provider,
                secret,
            ])
            const attestationPayload = this.buildAttestationPayload(
                chainId,
                encodedData,
                siweJwtPayload.sub as '0x${string}'
            )
            const delegated = await eas.getDelegated()
            const attester = this.getAttester(chainId)

            const signedDelegatedAttestation =
                await delegated.signDelegatedAttestation(
                    attestationPayload,
                    attester
                )
            return this.dataUtilsService.convertBigIntsToStrings(
                signedDelegatedAttestation
            )
        } catch (error) {
            this.logger.error(error, 'Failed to signed delegated attestation')
            throw new InternalServerErrorException(
                `Failed to signed delegated attestation`
            )
        }
    }

    async getSignedDelegatedRevocation(
        signDelegatedRevocationDto: SignDelegatedRevocationDto,
        uid: string
    ) {
        try {
            const { chainId, siweJwt } = signDelegatedRevocationDto
            const siweJwtPayload = await this.authService.validateToken(siweJwt)
            const attestation = await this.getAttestaion(chainId, uid)
            await this.checkAttestar(
                attestation,
                privateKeyToAddress(
                    this.configService.get<string>(
                        'wallet.privateKey'
                    ) as '0x${string}'
                )
            )
            await this.checkRecipient(
                attestation,
                siweJwtPayload.sub as '0x${string}'
            )
            const eas = this.getContract(chainId)
            const delegated = await eas.getDelegated()
            const attester = this.getAttester(chainId)
            const signedDelegatedRevocation =
                await delegated.signDelegatedRevocation(
                    {
                        schema: EAS_CONTRACTS[chainId].metadata.schema,
                        uid,
                        deadline: 0n,
                        value: 0n,
                    },
                    attester
                )

            return this.dataUtilsService.convertBigIntsToStrings(
                signedDelegatedRevocation
            )
        } catch (error) {
            this.logger.error(error, 'Failed to signed delegated revocation')
            throw new InternalServerErrorException(
                `Failed to signed delegated revocation`
            )
        }
    }

    async decryptAttestationSecret(
        decryptAttestationSecretDto: DecryptAttestationSecretDto,
        uid: string
    ) {
        try {
            const { chainId, siweJwt } = decryptAttestationSecretDto
            const siweJwtPayload = await this.authService.validateToken(siweJwt)
            const attestation = await this.getAttestaion(chainId, uid)
            await this.checkAttestar(
                attestation,
                privateKeyToAddress(
                    this.configService.get<string>(
                        'wallet.privateKey'
                    ) as '0x${string}'
                )
            )
            await this.checkRecipient(
                attestation,
                siweJwtPayload.sub as '0x${string}'
            )
            const decodedData = this.decodeAttestationData(attestation.data)
            const secret = decodedData[2].value.value
            return await this.litService.decryptFromJson(chainId, secret)
        } catch (error) {
            this.logger.error(error, 'Failed to decrypt attestation secret')
            throw new InternalServerErrorException(
                `Failed to decrypt attestation secret`
            )
        }
    }
}
