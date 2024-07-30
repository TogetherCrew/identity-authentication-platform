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
    ApiOkResponse,
    ApiFoundResponse,
} from '@nestjs/swagger'
import { OAuthService } from '../auth/oAuth.service'
import { AuthService } from '../auth/auth.service'
import { HandleOAuthCallback } from './dto/handle-oauth-callback-dto'
import { CryptoUtilsService } from '../utils/crypto-utils.service'
import { AUTH_PROVIDERS } from '../auth/constants/provider.constants'
import { JwtResponse } from '../auth//dto/jwt-response.dto'

@ApiTags(`${AUTH_PROVIDERS.GOOGLE} Authentication`)
@Controller(`auth/${AUTH_PROVIDERS.GOOGLE}`)
export class AuthGoogleController {
    constructor(
        private readonly oAuthService: OAuthService,
        private readonly authService: AuthService,
        private readonly cryptoService: CryptoUtilsService
    ) {}

    @Get('authenticate')
    @Redirect()
    @ApiOperation({ summary: 'Redirect to Google OAuth' })
    @ApiFoundResponse({ description: 'Redirection to Google OAuth.' })
    redirectToGoogle(@Session() session: any) {
        const state = this.cryptoService.generateState()
        const url = this.oAuthService.generateRedirectUrl(
            AUTH_PROVIDERS.GOOGLE,
            state
        )
        session.state = state
        return { url, statusCode: HttpStatus.FOUND }
    }

    @Get('authenticate/callback')
    @ApiOperation({ summary: 'Handle Google OAuth callback' })
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
            AUTH_PROVIDERS.GOOGLE,
            code
        )
        const jwt = await this.authService.generateJwt(
            userInfo.id,
            AUTH_PROVIDERS.GOOGLE
        )
        return { jwt }
    }
}
