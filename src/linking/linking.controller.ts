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
    ) { }

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
        const secret = 'secret'
        // await this.litService.encrypt(
        //     chainId,
        //     {
        //         id: anyJwtPayload.sub,
        //         provider: anyJwtPayload.provider,
        //     },
        //     address
        //     // siweJwtPayload.sub as '0x${string}'
        // )
        const delegatedAttestationRequest =
            await this.easService.getDelegatedAttestationRequest(
                chainId,
                [
                    keccak256(toHex(anyJwtPayload.sub)),
                    anyJwtPayload.provider,
                    secret,
                ],
                address
                // siweJwtPayload.sub as '0x${string}'
            )

        return this.dataUtilsService.formatBigIntValues(
            delegatedAttestationRequest
        )
    }
}
