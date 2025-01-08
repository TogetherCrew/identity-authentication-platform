import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import { DiscourseVerificationService } from './discourse-verification.service';
import { GenerateVerificationTokenResponseDto } from './dto/generate-verification-token-response.dto';
import { GenerateVerificationTokenDto } from './dto/generate-verification-token.dto';
import { VerifyResponseDto } from './dto/verify-response.dto';
import { VerifyDto } from './dto/verify.dto';

@ApiTags('Discourse Verification')
@Controller('discourse-verification')
export class DiscourseVerificationController {
    constructor(
        private readonly discourseVerificationService: DiscourseVerificationService
    ) {}

    @Post('token')
    @ApiOperation({
        summary: 'Generate discourse verification token using siweJwt',
    })
    @ApiOkResponse({
        description: 'Discourse verification token generated successfully.',
        type: GenerateVerificationTokenResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Generate discourse verification token failed.',
    })
    @HttpCode(HttpStatus.OK)
    async GenerateVerificationToken(
        @Body() generateVerificationTokenDto: GenerateVerificationTokenDto
    ): Promise<GenerateVerificationTokenResponseDto> {
        return {
            verificationJwt:
                await this.discourseVerificationService.generateVerificationToken(
                    generateVerificationTokenDto
                ),
        };
    }

    @Post('verify')
    @ApiOperation({
        summary: 'Verify discourse user using verificationJwt and siweJwt',
    })
    @ApiOkResponse({
        description: 'Discourse user Verified.',
        type: VerifyResponseDto,
    })
    @ApiBadRequestResponse({ description: 'SIWE verification failed.' })
    @HttpCode(HttpStatus.OK)
    async verify(@Body() verifyDto: VerifyDto): Promise<VerifyResponseDto> {
        return {
            discourseJwt:
                await this.discourseVerificationService.verifyDiscourseTopic(
                    verifyDto
                ),
        };
    }
}
