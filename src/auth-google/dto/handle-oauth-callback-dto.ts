import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
export class HandleOAuthCallback {
    @ApiProperty()
    @IsString()
    readonly code: string

    @ApiProperty()
    @IsString()
    readonly state: string
}
