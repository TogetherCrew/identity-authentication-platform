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
import { AuthGoogleService } from './auth-google.service'
import { HandleOAuthCallback } from './dto/handle-oauth-callback-dto'
import { JwtResponse } from '../auth/dto/jwt-response.dto'
import { AUTH_PROVIDERS } from '../auth/constants/provider.constants'
import { CryptoUtilsService } from '../utils/crypto-utils.service'
import { OAuthService } from '../auth/oAuth.service'
@ApiTags('Google Authentication')
@Controller('auth/google')
export class AuthGoogleController {
    constructor(
        private readonly oAuthService: OAuthService,
        private readonly cryptoService: CryptoUtilsService,
        private readonly authGoogleService: AuthGoogleService
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
        const redirectUrl = await this.authGoogleService.handleOAuthCallback(
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
