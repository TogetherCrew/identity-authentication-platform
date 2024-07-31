import {
    Controller,
    Get,
    Query,
    Redirect,
    HttpStatus,
    Session,
} from '@nestjs/common'
import {
    ApiTags,
    ApiOperation,
    ApiFoundResponse,
    ApiOkResponse,
} from '@nestjs/swagger'
import { OAuthService } from '../auth/oAuth.service'
import { HandleOAuthCallback } from './dto/handle-oauth-callback-dto'
import { CryptoUtilsService } from '../utils/crypto-utils.service'
import { AUTH_PROVIDERS } from '../auth/constants/provider.constants'
import { JwtResponse } from '../auth//dto/jwt-response.dto'
import { AuthDiscordService } from './auth-discord.service'

@ApiTags(`${AUTH_PROVIDERS.DISCORD} Authentication`)
@Controller(`auth/${AUTH_PROVIDERS.DISCORD}`)
export class AuthDiscordController {
    constructor(
        private readonly oAuthService: OAuthService,
        private readonly cryptoService: CryptoUtilsService,
        private readonly authDiscordService: AuthDiscordService
    ) {}

    @Get('authenticate')
    @Redirect()
    @ApiOperation({ summary: 'Redirect to Discord OAuth' })
    @ApiFoundResponse({ description: 'Redirection to Discord OAuth.' })
    redirectToDiscord(@Session() session: any) {
        const state = this.cryptoService.generateState()
        const url = this.oAuthService.generateRedirectUrl(
            AUTH_PROVIDERS.DISCORD,
            state
        )
        session.state = state
        return { url, statusCode: HttpStatus.FOUND }
    }

    @Get('authenticate/callback')
    @Redirect()
    @ApiOperation({ summary: 'Handle Discord OAuth callback' })
    @ApiOkResponse({
        description: 'JWT generated successfully.',
        type: JwtResponse,
    })
    async handleOAuthCallback(
        @Query() { code, state }: HandleOAuthCallback,
        @Session() session: any
    ) {
        const redirectUrl = await this.authDiscordService.handleOAuthCallback(
            code,
            state,
            session.state
        )
        return {
            url: redirectUrl,
            statusCode: HttpStatus.FOUND,
        }
    }
}
