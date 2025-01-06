import { ApiProperty } from '@nestjs/swagger';

export class NonceResponse {
    @ApiProperty({ description: 'Nonce generated successfully.' })
    nonce: string;
}
