import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsNumber, IsIn } from 'class-validator'
import { SignMessageReturnType, Hex } from 'viem'
import { SUPPORTED_CHAINS } from '../../shared/constants/chain.constants'

export class VerifySiweDto {
    @ApiProperty({
        description: 'The SIWE message sent by the client.',
        example: 'ethereum-eip4361-message',
    })
    @IsString()
    @IsNotEmpty()
    readonly message: SignMessageReturnType

    @ApiProperty({
        description: 'Signature of the SIWE message.',
        example: '0xSignature',
    })
    @IsString()
    @IsNotEmpty()
    readonly signature: Hex

    @ApiProperty({
        description: 'Chain Id',
        example: '1',
        required: true,
        enum: SUPPORTED_CHAINS,
    })
    @IsNumber()
    @IsNotEmpty()
    @IsIn(SUPPORTED_CHAINS)
    readonly chainId: number
}
