import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AuthService } from '../auth/auth.service'
import { ViemUtilsService } from '../utils/viem.utils.service'
import { LinkIdentitiesDto } from './dto/link-identities.dto'
import { EasService } from '../eas/eas.service'
import { LitService } from 'src/lit/lit.service'
import { keccak256, toHex } from 'viem'

@ApiTags(`Linking`)
@Controller(`linking`)
export class LinkingController {
    constructor(
        private readonly authService: AuthService,
        private readonly viemUtilsService: ViemUtilsService,
        private readonly easService: EasService,
        private readonly litService: LitService
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
        // TODO: Check the jwt payloads
        const siweJwtPayload = await this.authService.validateToken(siweJwt)
        const anyJwtPayload = await this.authService.validateToken(anyJwt)
        const secret = await this.litService.encrypt(
            chainId,
            {
                id: anyJwtPayload.sub,
                provider: anyJwtPayload.provider,
            },
            siweJwtPayload.sub as '0x${string}'
        )
        const delegatedAttestationRequest =
            await this.easService.getDelegatedAttestationRequest(
                chainId,
                [
                    keccak256(toHex(anyJwtPayload.sub)),
                    anyJwtPayload.provider,
                    secret,
                ],
                siweJwtPayload.sub as '0x${string}'
            )

        // const userAccount = privateKeyToAccount(generatePrivateKey())
        // const secret = await this.litService.encrypt(
        //     chainId,
        //     {
        //         id: anyJwtPayload.sub,
        //         provider: anyJwtPayload.provider,
        //     },
        //     userAccount.address
        // )
        // const request = await this.easService.getDelegatedAttestationRequest(
        //     chainId,
        //     [
        //         keccak256(toHex(anyJwtPayload.sub)),
        //         anyJwtPayload.provider,
        //         secret,
        //     ],
        //     userAccount.address
        // )

        console.log(delegatedAttestationRequest)
    }
}
