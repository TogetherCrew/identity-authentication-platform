import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class GenerateVerificationTokenDto {
    @ApiProperty({
        description: 'The siwe JWT',
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @IsString()

    // @JwtProvider(AUTH_PROVIDERS.SIWE)
    readonly siweJwt: string;
}
