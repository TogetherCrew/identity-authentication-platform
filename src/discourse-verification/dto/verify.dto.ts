import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class VerifyDto {
    @ApiProperty({
        description: 'the discourse topic url.',
        example: 'https://forum.arbitrum.foundation',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    topicUrl: string;

    @ApiProperty({
        description: 'The verification JWT.',
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    verificationJwt: string;
}
