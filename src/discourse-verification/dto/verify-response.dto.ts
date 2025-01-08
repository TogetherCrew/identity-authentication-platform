import { ApiProperty } from '@nestjs/swagger';

export class VerifyResponseDto {
    @ApiProperty({
        description:
            'Discourse JWT that can be used for authenticated actions on the Discourse instance',
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjMsImJhc2VVUkwiOiJodHRwczovL2ZvcnVtcy5leGFtcGxlLmNvbSIsImlhdCI6MTY5MTMxMjAwMH0.x4dF-KO9drgBbLj197UQVHev4dgd0DcNEkN8bsuEPnY',
    })
    discourseJwt: string;
}
