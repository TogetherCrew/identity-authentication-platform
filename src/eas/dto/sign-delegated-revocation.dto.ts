import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsNumber } from 'class-validator'
import { JwtProvider } from '../../shared/decorators/jwt-provider.decorator'
import { AUTH_PROVIDERS } from '../../auth/constants/provider.constants'

export class SignDelegatedRevocationDto {
    @ApiProperty({
        description: 'The siwe JWT',
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @JwtProvider(AUTH_PROVIDERS.SIWE)
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
