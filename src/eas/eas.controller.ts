import {
    Controller,
    Post,
    Body,
    HttpStatus,
    HttpCode,
    Param,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AuthService } from '../auth/auth.service'
import { SignDelegatedAttestationDto } from './dto/sign-delegated-attestation.dto'
import { SignDelegatedRevocationDto } from './dto/sign-delegated-revocation.dto'
import { EasService } from '../eas/eas.service'
import { LitService } from '../lit/lit.service'
import { keccak256, toHex } from 'viem'
import { DataUtilsService } from '../utils/data-utils.service'
import { ApiParam } from '@nestjs/swagger'

@ApiTags(`Eas`)
@Controller(`eas`)
export class EasController {
    constructor(
        private readonly authService: AuthService,
        private readonly easService: EasService,
        private readonly litService: LitService,
        private readonly dataUtilsService: DataUtilsService
    ) {}

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
        const { chainId, anyJwt, siweJwt } = signDelegatedAttestationDto
        const siweJwtPayload = await this.authService.validateToken(siweJwt)
        const anyJwtPayload = await this.authService.validateToken(anyJwt)
        const secret = await this.litService.encryptToJson(
            chainId,
            {
                id: anyJwtPayload.sub,
                provider: anyJwtPayload.provider,
            },
            siweJwtPayload.sub as '0x${string}'
        )
        return this.dataUtilsService.convertBigIntsToStrings(
            await this.easService.getSignedDelegatedAttestation(
                chainId,
                [
                    keccak256(toHex(anyJwtPayload.sub)),
                    anyJwtPayload.provider,
                    secret,
                ],
                siweJwtPayload.sub as '0x${string}'
            )
        )
    }

    @Post(':id/sign-delegated-revocation')
    @ApiOperation({
        summary: 'get signed delegated revocation ',
    })
    @ApiResponse({
        status: 200,
        description: 'Get signed delegated revocation via attestation uid',
    })
    @ApiParam({ name: 'uid', type: 'string', description: 'attestation uid' })
    @HttpCode(HttpStatus.OK)
    async revoke(
        @Param() uid: string,
        @Body() signDelegatedRevocationDto: SignDelegatedRevocationDto
    ) {
        const { chainId, siweJwt } = signDelegatedRevocationDto
        const siweJwtPayload = await this.authService.validateToken(siweJwt)
        const attestation = await this.easService.getAttestaion(chainId, uid)
        await this.easService.revokeable(
            attestation,
            siweJwtPayload.sub as '0x${string}'
        )
        return this.dataUtilsService.convertBigIntsToStrings(
            await this.easService.getSignedDelegatedRevocation(chainId, uid)
        )
    }
}