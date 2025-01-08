import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { AUTH_PROVIDERS } from '../../auth/constants/provider.constants';
import { JwtProvider } from '../../shared/decorators/jwt-provider.decorator';

export class GenerateVerificationTokenDto {
    @ApiProperty({
        description: 'The siwe JWT',
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @JwtProvider(AUTH_PROVIDERS.SIWE)
    readonly siweJwt: string;
}
