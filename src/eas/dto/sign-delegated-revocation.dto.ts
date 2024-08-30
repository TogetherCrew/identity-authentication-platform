import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsNumber } from 'class-validator'
import { JwtProvider } from '../../shared/decorators/jwt-provider.decorator'
import { AUTH_METHODS } from '../../auth/constants/auth.constants'

export class SignDelegatedRevocationDto {
    @ApiProperty({
        description: 'The siwe JWT',
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @JwtProvider(AUTH_METHODS.SIWE)
    readonly siweJwt: string
    @ApiProperty({
        description: 'Chain Id',
        example: '11155111',
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    readonly chainId: number
}
