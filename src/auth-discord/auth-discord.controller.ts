import {
    Controller,
    Get,
    Query,
    Redirect,
    HttpException,
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
import { AuthService } from '../auth/auth.service'
import { HandleOAuthCallback } from './dto/handle-oauth-callback-dto'
import { CryptoUtilsService } from '../utils/crypto-utils.service'
import { AUTH_PROVIDERS } from '../auth/constants/provider.constants'
import { JwtResponse } from '../auth//dto/jwt-response.dto'

@ApiTags(`${AUTH_PROVIDERS.DISCORD} Authentication`)
@Controller(`auth/${AUTH_PROVIDERS.DISCORD}`)
export class AuthDiscordController {
    constructor(
        private readonly oAuthService: OAuthService,
        private readonly authService: AuthService,
        private readonly cryptoService: CryptoUtilsService
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
    @ApiOperation({ summary: 'Handle Discord OAuth callback' })
    @ApiOkResponse({
        description: 'JWT generated successfully.',
        type: JwtResponse,
    })
    async handleOAuthCallback(
        @Query() { code, state }: HandleOAuthCallback,
        @Session() session: any
    ) {
        if (!this.cryptoService.validateState(state, session.state)) {
            throw new HttpException('Invalid state', HttpStatus.FORBIDDEN)
        }
        const userInfo = await this.oAuthService.handleOAuth2Callback(
            AUTH_PROVIDERS.DISCORD,
            code
        )
        const jwt = await this.authService.generateJwt(
            userInfo.id,
            AUTH_PROVIDERS.DISCORD
        )
        return { jwt }
    }
}
