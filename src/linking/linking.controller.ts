import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AuthService } from '../auth/auth.service'
import { LinkIdentitiesDto } from './dto/link-identities.dto'
import { EasService } from '../eas/eas.service'
import { LitService } from 'src/lit/lit.service'
import { keccak256, toHex } from 'viem'
import { DataUtilsService } from 'src/utils/data-utils.service'
import { generatePrivateKey, privateKeyToAddress } from 'viem/accounts'

@ApiTags(`Linking`)
@Controller(`linking`)
export class LinkingController {
    constructor(
        private readonly authService: AuthService,
        private readonly easService: EasService,
        private readonly litService: LitService,
        private readonly dataUtilsService: DataUtilsService
    ) {}

    @Post('link-identities')
    @ApiOperation({ summary: 'Link identities via jwt tokens' })
    @ApiResponse({
        status: 200,
        description: 'Generated delegated attestation request',
    })
    @HttpCode(HttpStatus.OK)
    async linkIdentities(@Body() linkIdentitiesDto: LinkIdentitiesDto) {
        const { chainId, anyJwt, siweJwt } = linkIdentitiesDto
        // const siweJwtPayload = await this.authService.validateToken(siweJwt)
        const pk = generatePrivateKey()
        const address = privateKeyToAddress(pk)
        const anyJwtPayload = await this.authService.validateToken(anyJwt)
        const secret = await this.litService.encryptToJson(
            chainId,
            {
                id: anyJwtPayload.sub,
                provider: anyJwtPayload.provider,
            },

            // siweJwtPayload.sub as '0x${string}',
            address
        )
        console.log('secretHAHA', secret)

        const decrypt = await this.litService.decryptFromJson(chainId, secret)
        console.log('decryptVVVV', decrypt)
        const delegatedAttestationRequest =
            await this.easService.getSignedDelegatedAttestation(
                chainId,
                [
                    keccak256(toHex(anyJwtPayload.sub)),
                    anyJwtPayload.provider,
                    secret,
                ],
                // siweJwtPayload.sub as '0x${string}',
                address
            )

        console.log(
            await this.easService.getSignedDelegatedRevocation(
                chainId,
                '0x8c2c20b5001ef8f9ab0da014f94ef48da432a3ba7550e518cb8a1b51877ee286'
            )
        )

        const eas = await this.easService.getAttestaion(
            chainId,
            '0x8c2c20b5001ef8f9ab0da014f94ef48da432a3ba7550e518cb8a1b51877ee286'
        )
        console.log('vaaaa', eas.attester, eas.recipient, typeof eas)
        return this.dataUtilsService.convertBigIntsToStrings(
            delegatedAttestationRequest
        )
    }
}
