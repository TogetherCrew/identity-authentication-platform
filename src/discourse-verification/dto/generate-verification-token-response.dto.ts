import { ApiProperty } from '@nestjs/swagger';

export class GenerateVerificationTokenResponseDto {
    @ApiProperty({
        description:
            'Generated verification JWT token to embed in a Discourse topic',
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2RlIjoiMjMxMjQ... (truncated)',
    })
    verificationJwt: string;
}
