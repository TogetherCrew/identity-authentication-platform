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

@ApiTags('Discord Authentication')
@Controller('auth/discord')
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
        const state = this.cryptoService.generateState();
        const url = this.oAuthService.generateRedirectUrl(
            AUTH_PROVIDERS.DISCORD,
            state
        );
        session.state = state;
        return { url, statusCode: HttpStatus.FOUND };
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
            AUTH_PROVIDERS.DISCORD
        );
        return {
            url: redirectUrl,
            statusCode: HttpStatus.FOUND,
        };
    }
}
