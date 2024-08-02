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
import { HandleOAuthCallback } from './dto/handle-oauth-callback-dto'
import { JwtResponse } from '../auth/dto/jwt-response.dto'
import { AUTH_PROVIDERS } from '../auth/constants/provider.constants'
import { CryptoUtilsService } from '../utils/crypto-utils.service'
import { OAuthService } from '../auth/oAuth.service'
@ApiTags(`${AUTH_PROVIDERS.GOOGLE} Authentication`)
@Controller(`auth/${AUTH_PROVIDERS.GOOGLE}`)
export class AuthGoogleController {
    constructor(
        private readonly oAuthService: OAuthService,
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
    @Redirect()
    @ApiOperation({ summary: 'Handle Google OAuth callback' })
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
            AUTH_PROVIDERS.GOOGLE
        )

        return {
            url: redirectUrl,
            statusCode: HttpStatus.FOUND,
        }
    }
}
