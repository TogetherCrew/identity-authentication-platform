import { ApiProperty } from '@nestjs/swagger';

export class VerifyResponseDto {
    @ApiProperty({
        description:
            'Discourse JWT that can be used for authenticated actions on the Discourse instance',
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6',
    })
    discourseJwt: string;
}
