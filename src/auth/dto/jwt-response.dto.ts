import { ApiProperty } from '@nestjs/swagger';

export class JwtResponse {
    @ApiProperty({ description: 'The JSON Web Token' })
    jwt: string;
}
