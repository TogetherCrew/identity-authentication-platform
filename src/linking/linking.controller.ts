import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AuthService } from '../auth/auth.service'
import { ViemUtilsService } from '../utils/viem.utils.service'
import { LinkIdentitiesDto } from './dto/link-identities.dto'
import { EasService } from '../EAS/eas.service'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'

@ApiTags(`Linking`)
@Controller(`linking`)
export class LinkingController {
    constructor(
        private readonly authService: AuthService,
        private readonly viemUtilsService: ViemUtilsService,
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
        const { chainId } = linkIdentitiesDto
        // TODO: Check the jwt payloads
        // const walletJwtPayload = await this.authService.validateToken(walletJwt)
        // const anyJwtPayload = await this.authService.validateToken(anyJwt)
        // await this.easService.getDelegatedAttestationRequest(
        //     chainId,
        //     ['hash', 'provider', 'secret'],
        //     walletJwtPayload.sub as '0x${string}'
        // )

        const userAccount = privateKeyToAccount(generatePrivateKey())
        const request = await this.easService.getDelegatedAttestationRequest(
            chainId,
            [
                '0x41570bc46b81fc88ef12a6077dd640aa9ec7a2d0b00b4919d151d495a0590938',
                'provider',
                'secret',
            ],
            userAccount.address
        )

        console.log(request)
    }
}
