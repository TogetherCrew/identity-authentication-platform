import { Address } from 'viem'

export interface IAttestationRequestData {
    recipient: Address
    data: Address
    expirationTime: bigint
    revocable: boolean
    refUID: Address
    value: bigint
}

export interface IDelegatedAttestationMessage extends IAttestationRequestData {
    schema: Address
    attester: Address
    deadline: bigint
    nonce: bigint
}

export interface IAttestationRequest {
    schema: Address
    data: IAttestationRequestData
}

export interface IDelegatedAttestationRequest extends IAttestationRequest {
    signature: { r: Address; s: Address; v: number }
    attester: Address
    deadline: bigint
}
