import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class SignDelegatedAttestationDto {
    @ApiProperty({
        description: 'The siwe JWT',
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @IsString()
    readonly siweJwt: string;
    @ApiProperty({
        description: 'The siwe JWT or any provider JWT.',
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkxasewrOiIxMjM0NTY3ODkwIiwibmFtZSI6',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    readonly anyJwt: string;

    @ApiProperty({
        description: 'Chain Id',
        example: '11155111',
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    readonly chainId: number;
}
