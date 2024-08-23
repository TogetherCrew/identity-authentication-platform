import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsNumber } from 'class-validator'
import { JwtProvider } from '../../shared/decorators/jwt-provider.decorator'
import { AUTH_PROVIDERS } from '../../auth/constants/provider.constants'

export class LinkIdentitiesDto {
    @ApiProperty({
        description: 'The siwe JWT',
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @JwtProvider(AUTH_PROVIDERS.GOOGLE)
    readonly siweJwt: string
    @ApiProperty({
        description: 'The siwe JWT or any provider JWT.',
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkxasewrOiIxMjM0NTY3ODkwIiwibmFtZSI6',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    readonly anyJwt: string

    @ApiProperty({
        description: 'Chain Id',
        example: '11155111',
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    readonly chainId: number
}
