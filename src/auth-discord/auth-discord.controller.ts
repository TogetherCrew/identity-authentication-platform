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
import { OAUTH_METHODS } from '../auth/constants/auth.constants'
import { JwtResponse } from '../auth//dto/jwt-response.dto'

@ApiTags(`${OAUTH_METHODS.DISCORD} Authentication`)
@Controller(`auth/${OAUTH_METHODS.DISCORD}`)
export class AuthDiscordController {
    constructor(
        private readonly oAuthService: OAuthService,
        private readonly cryptoService: CryptoUtilsService
    ) {}

    @Get('authenticate')
    @Redirect()
    @ApiOperation({ summary: 'Redirect to Discord OAuth' })
    @ApiFoundResponse({ description: 'Redirection to Discord OAuth.' })
    redirectToDiscord(@Session() session: any) {
        const state = this.cryptoService.generateState()
        const url = this.oAuthService.generateRedirectUrl(
            OAUTH_METHODS.DISCORD,
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
        const redirectUrl = await this.oAuthService.handleOAuth2Callback(
            state,
            session.state,
            code,
            OAUTH_METHODS.DISCORD
        )
        return {
            url: redirectUrl,
            statusCode: HttpStatus.FOUND,
        }
    }
}
