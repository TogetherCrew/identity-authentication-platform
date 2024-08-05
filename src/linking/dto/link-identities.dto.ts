import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsNumber } from 'class-validator'

export class LinkIdentitiesDto {
    @ApiProperty({
        description: 'The wallet JWT',
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    readonly siweJwt: string

    @ApiProperty({
        description: 'The wallet JWT or any provider JWT.',
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
