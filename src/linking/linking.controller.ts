import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AuthService } from '../auth/auth.service'
import { ViemService } from '../utils/viem.service'
import { LinkIdentitiesDto } from './dto/link-identities.dto'
import { EasService } from '../eas/eas.service'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'

@ApiTags(`Linking`)
@Controller(`linking`)
export class LinkingController {
    constructor(
        private readonly authService: AuthService,
        private readonly viemService: ViemService,
        private readonly easService: EasService
    ) {}

    @Post('link-identities')
    @ApiOperation({ summary: 'Link identities via jwt tokens' })
    @ApiResponse({
        status: 200,
        description: 'Generated delegated attestation request',
    })
    @HttpCode(HttpStatus.OK)
    async linkIdentities(@Body() linkIdentitiesDto: LinkIdentitiesDto) {
        const { anyJwt, chainId } = linkIdentitiesDto
        // TODO: Check the jwt payloads
        // const walletJwtPayload = await this.authService.validateToken(walletJwt)
        const anyJwtPayload = await this.authService.validateToken(anyJwt)
        // await this.easService.getDelegatedAttestationRequest(
        //     chainId,
        //     ['hash', anyJwtPayload.sub, walletJwtPayload.sub],
        //     walletJwtPayload.sub
        // )

        const userAccount = privateKeyToAccount(generatePrivateKey())
        const request = await this.easService.getDelegatedAttestationRequest(
            chainId,
            ['hash', anyJwtPayload.sub, userAccount.address],
            userAccount.address
        )

        console.log(request)
    }
}
