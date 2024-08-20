import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ViemUtilsService } from '../utils/viem.utils.service'
// import {
//     SCHEMA_TYPES,
//     ATTEST_PRIMARY_TYPE,
// } from './constants/attestation.constants'
// import {
//     getContract,
//     Address,
//     encodeAbiParameters,
//     parseSignature,
//     EncodeAbiParametersReturnType,
// } from 'viem'
// import { SUPPORTED_CHAINS } from '../shared/constants/chain.constants'
// import {
//     IAttestationRequestData,
//     IDelegatedAttestationRequest,
//     IDelegatedAttestationMessage,
// } from './interfaces/attestation.interfaces'
// import {
//     EAS,
//     NO_EXPIRATION,
//     ZERO_BYTES32,
// } from '@ethereum-attestation-service/eas-sdk'
import { SupportedChainId } from '../shared/types/chain.type'
import { Contract, Signer, VoidSigner } from 'ethers'
import { WalletUtilsService } from 'src/utils/wallet.utils.service'
import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk'
import { Address, stringToHex } from 'viem'
import { SUPPORTED_CHAINS } from 'src/shared/constants/chain.constants'

@Injectable()
export class EasService {
    private attester: Signer
    private easContracts: Map<number, any> = new Map()

    constructor(
        private readonly viemUtilsService: ViemUtilsService,
        private readonly configService: ConfigService,
        private readonly walletUtilsService: WalletUtilsService
    ) {
        this.attester = walletUtilsService.getSigner(
            this.configService.get<string>('wallet.privateKey') as string
        )
        // this.setEasContracts()
    }
    // private setEasContracts() {
    //     for (const chain of SUPPORTED_CHAINS) {
    //         const publicClient = this.viemUtilsService.getPublicClient(
    //             chain.chainId
    //         )
    //         if (publicClient) {
    //             const easContract = getContract({
    //                 address: chain.easContractAddress as '0x${string}',
    //                 abi: chain.easContractAbi,
    //                 client: publicClient,
    //             })
    //             this.easContracts.set(chain.chainId, easContract)
    //         }
    //     }
    // }

    // getContract(chainId: SupportedChainId) {
    //     return this.easContracts.get(chainId)
    // }

    // getSchemaUUID(chainId: SupportedChainId): '0x${string}' {
    //     const chain = SUPPORTED_CHAINS.find(
    //         (chain) => chain.chainId === chainId
    //     )
    //     if (!chain) {
    //         throw new Error(`Unsupported chain ID: ${chainId}`)
    //     }
    //     return chain.easSchemaUUID as '0x${string}'
    // }
    // getContractAddress(chainId: SupportedChainId): '0x${string}' {
    //     const chain = SUPPORTED_CHAINS.find(
    //         (chain) => chain.chainId === chainId
    //     )
    //     if (!chain) {
    //         throw new Error(`Unsupported chain ID: ${chainId}`)
    //     }
    //     return chain.easContractAddress as '0x${string}'
    // }
    // getContractABI(chainId: SupportedChainId) {
    //     const chain = SUPPORTED_CHAINS.find(
    //         (chain) => chain.chainId === chainId
    //     )
    //     if (!chain) {
    //         throw new Error(`Unsupported chain ID: ${chainId}`)
    //     }
    //     return chain.easContractAbi
    // }

    // async getDomain(chainId: SupportedChainId) {
    //     const eas = await this.getContract(chainId)
    //     if (!eas) {
    //         throw new Error(`EAS contract not found for chain ID: ${chainId}`)
    //     }
    //     return {
    //         name: 'EAS',
    //         version: await eas.read.VERSION(),
    //         chainId,
    //         verifyingContract: eas.address,
    //     }
    // }

    // async getNounce(chainId: SupportedChainId) {
    //     const eas = await this.getContract(chainId)
    //     if (!eas) {
    //         throw new Error(`EAS contract not found for chain ID: ${chainId}`)
    //     }
    //     return await eas.read.getNonce([this.attester.address])
    // }

    // createAttestationRequestData(
    //     data: EncodeAbiParametersReturnType,
    //     recipient: Address
    // ): IAttestationRequestData {
    //     const requestData: IAttestationRequestData = {
    //         data,
    //         recipient,
    //         expirationTime: NO_EXPIRATION,
    //         refUID: ZERO_BYTES32,
    //         revocable: true,
    //         value: NO_EXPIRATION,
    //     }
    //     return requestData
    // }

    // createDelegatedAttestationRequest(
    //     requestData: IAttestationRequestData,
    //     chainId: SupportedChainId,
    //     signature: '0x${string}'
    // ): IDelegatedAttestationRequest {
    //     const { r, s, v } = parseSignature(signature)
    //     const request: IDelegatedAttestationRequest = {
    //         signature: { r, s, v: Number(v) },
    //         attester: this.attester.address,
    //         schema: this.getSchemaUUID(chainId),
    //         data: requestData,
    //         deadline: 0n,
    //     }
    //     return request
    // }
    // createAttestationMessage(
    //     requestData: IAttestationRequestData,
    //     chainId: SupportedChainId,
    //     nonce: any
    // ): IDelegatedAttestationMessage {
    //     const message: IDelegatedAttestationMessage = {
    //         ...requestData,
    //         schema: this.getSchemaUUID(chainId),
    //         attester: this.attester.address,
    //         deadline: NO_EXPIRATION,
    //         nonce,
    //     }
    //     return message
    // }

    // async signAttestationMessage(
    //     message: IDelegatedAttestationMessage,
    //     domain: any
    // ) {
    //     const signature = await this.attester.signTypedData({
    //         domain,
    //         types: {
    //             // TODO: Use ATTEST_TYPE
    //             Attest: [
    //                 { name: 'attester', type: 'address' },
    //                 { name: 'schema', type: 'bytes32' },
    //                 { name: 'recipient', type: 'address' },
    //                 { name: 'expirationTime', type: 'uint64' },
    //                 { name: 'revocable', type: 'bool' },
    //                 { name: 'refUID', type: 'bytes32' },
    //                 { name: 'data', type: 'bytes' },
    //                 { name: 'value', type: 'uint256' },
    //                 { name: 'nonce', type: 'uint256' },
    //                 { name: 'deadline', type: 'uint64' },
    //             ],
    //         },
    //         primaryType: ATTEST_PRIMARY_TYPE,
    //         message,
    //     })
    //     return signature
    // }

    async simulate(data: any, recipient: Address) {
        try {
            console.log('sim')

            const contract = new Contract(
                SUPPORTED_CHAINS[0].easContractAddress,
                SUPPORTED_CHAINS[0].easContractAbi,
                this.walletUtilsService.getProvider()
            )

            const other = new VoidSigner(recipient)
            contract.connect(other)
            const response = await contract.attestByDelegation.staticCall(data)
            console.log(response)
        } catch (err) {
            console.log(err)
        }
    }

    async getDelegatedAttestationRequest(
        chainId: SupportedChainId,
        params,
        recipient: Address
    ) {
        const EASContractAddress = '0xC2679fBD37d54388Ce493F1DB75320D236e1815e'
        const eas = new EAS(EASContractAddress)
        eas.connect(this.attester)

        const delegated = await eas.getDelegated()

        // console.log('delegated', delegated)

        const schemaEncoder = new SchemaEncoder(
            'bytes32 key, string provider, string secret'
        )

        const encodedData = schemaEncoder.encodeData([
            {
                name: 'key',
                value: stringToHex('Hello World!', { size: 32 }),
                type: 'bytes32',
            }, // TODO: replace with key
            { name: 'provider', value: 'google', type: 'string' },
            { name: 'secret', value: 'my secret', type: 'string' },
        ])

        // console.log(encodedData)

        const response = await delegated.signDelegatedAttestation(
            {
                schema: '0x85e90e3e16d319578888790af3284fea8bca549305071531e7478e3e0b5e7d6d',
                recipient,
                expirationTime: 0n, // Unix timestamp of when attestation expires (0 for no expiration)
                revocable: true,
                refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
                data: encodedData,
                deadline: 0n, // Unix timestamp of when signature expires (0 for no expiration)
                value: 0n,
            },
            this.attester
        )

        // console.log(response)
        // console.log(await this.attester.getAddress())

        await this.simulate(
            {
                schema: response.message.schema,
                data: {
                    recipient,
                    expirationTime: 0n, // Unix timestamp of when attestation expires (0 for no expiration)
                    revocable: true,
                    refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    data: encodedData,
                    value: 0n,
                },
                signature: response.signature,
                attester: await this.attester.getAddress(),
                // deadline: 0n, // Unix timestamp of when signature expires (0 for no expiration)
            },
            recipient
        )

        // const domain = await this.getDomain(chainId)
        // const nonce = await this.getNounce(chainId)
        // const data = encodeAbiParameters(SCHEMA_TYPES, params)
        // const attestationRequestData = this.createAttestationRequestData(
        //     data,
        //     recipient
        // )
        // const attestationMessage = this.createAttestationMessage(
        //     attestationRequestData,
        //     chainId,
        //     nonce
        // )
        // const signature = await this.signAttestationMessage(
        //     attestationMessage,
        //     domain
        // )
        // return this.createDelegatedAttestationRequest(
        //     attestationRequestData,
        //     chainId,
        //     signature as '0x${string}'
        // )
    }
}
