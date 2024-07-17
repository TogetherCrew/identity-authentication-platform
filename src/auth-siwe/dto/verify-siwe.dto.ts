import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class VerifySiweDto {
    @ApiProperty({
        description: 'The SIWE message sent by the client.',
        example: 'ethereum-eip4361-message',
    })
    @IsString()
    readonly message: string

    @ApiProperty({
        description: 'Signature of the SIWE message.',
        example: '0xSignature',
    })
    @IsString()
    readonly signature: string
}
