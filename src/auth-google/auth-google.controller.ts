import {
    Controller,
    Get,
    HttpStatus,
    Query,
    Redirect,
    Session,
} from '@nestjs/common';
import {
    ApiFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import { AUTH_PROVIDERS } from '../auth/constants/provider.constants';
import { JwtResponse } from '../auth/dto/jwt-response.dto';
import { OAuthService } from '../auth/oAuth.service';
import { CryptoUtilsService } from '../utils/crypto-utils.service';
import { HandleOAuthCallback } from './dto/handle-oauth-callback-dto';

@ApiTags('Google Authentication')
@Controller('auth/google')
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
        const state = this.cryptoService.generateState();
        const url = this.oAuthService.generateRedirectUrl(
            AUTH_PROVIDERS.GOOGLE,
            state
        );
        session.state = state;
        return { url, statusCode: HttpStatus.FOUND };
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
        );

        return {
            url: redirectUrl,
            statusCode: HttpStatus.FOUND,
        };
    }
}
