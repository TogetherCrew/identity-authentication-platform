import {
    Controller,
    Post,
    Body,
    HttpStatus,
    HttpCode,
    Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SignDelegatedAttestationDto } from './dto/sign-delegated-attestation.dto';
import { SignDelegatedRevocationDto } from './dto/sign-delegated-revocation.dto';
import { DecryptAttestationSecretDto } from './dto/decrypt-attestation-secret.dto';
import { EasService } from '../eas/eas.service';
import { ApiParam } from '@nestjs/swagger';

@ApiTags(`Eas`)
@Controller(`eas`)
export class EasController {
    constructor(private readonly easService: EasService) {}

    @Post('sign-delegated-attestation')
    @ApiOperation({ summary: 'get signed delegated attestation' })
    @ApiResponse({
        status: 200,
        description: 'get signed delegated via jwt tokens',
    })
    @HttpCode(HttpStatus.OK)
    async signDelegatedAttestation(
        @Body() signDelegatedAttestationDto: SignDelegatedAttestationDto
    ) {
        return await this.easService.getSignedDelegatedAttestation(
            signDelegatedAttestationDto
        );
    }

    @Post(':uid/sign-delegated-revocation')
    @ApiOperation({
        summary: 'get signed delegated revocation ',
    })
    @ApiResponse({
        status: 200,
        description: 'Get signed delegated revocation by attestation uid',
    })
    @ApiParam({ name: 'uid', type: 'string', description: 'attestation uid' })
    @HttpCode(HttpStatus.OK)
    async revoke(
        @Param('uid') uid: string,
        @Body() signDelegatedRevocationDto: SignDelegatedRevocationDto
    ) {
        return await this.easService.getSignedDelegatedRevocation(
            signDelegatedRevocationDto,
            uid
        );
    }

    @Post(':uid/decrypt-attestation-secret')
    @ApiOperation({
        summary: 'decrypt attestation secret ',
    })
    @ApiResponse({
        status: 200,
        description: 'decrypt attestation secret via attestation uid',
    })
    @ApiParam({ name: 'uid', type: 'string', description: 'attestation uid' })
    @HttpCode(HttpStatus.OK)
    async decryptSecret(
        @Param('uid') uid: string,
        @Body() decryptAttestationSecretDto: DecryptAttestationSecretDto
    ) {
        return await this.easService.decryptAttestationSecret(
            decryptAttestationSecretDto,
            uid
        );
    }
}
