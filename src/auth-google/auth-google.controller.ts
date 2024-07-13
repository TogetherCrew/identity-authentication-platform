import {
    Controller,
    Get,
    Query,
    Redirect,
    HttpException,
    HttpStatus,
    Injectable,
    Session,
} from '@nestjs/common'
import { OAuthService } from '../auth/oAuth.service'
import { AuthService } from '../auth/auth.service'
import { HandleOAuthCallback } from './dto/handle-oauth-callback-dto'
import { CryptoUtilsService } from '../utils/crypto-utils.service'
import { OAUTH_PROVIDERS } from '../auth/constants/oAuth.constants'

@Injectable()
@Controller(OAUTH_PROVIDERS.GOOGLE)
export class AuthGoogleController {
    constructor(
        private readonly oAuthService: OAuthService,
        private readonly authService: AuthService,
        private readonly cryptoService: CryptoUtilsService
    ) {}

    @Get('authenticate')
    @Redirect()
    redirectToGoogle(@Session() session: any) {
        const state = this.cryptoService.generateState()
        const url = this.oAuthService.generateRedirectUrl(
            OAUTH_PROVIDERS.GOOGLE,
            state
        )
        session.state = state
        return { url, statusCode: HttpStatus.FOUND }
    }

    @Get('authenticate/callback')
    async handleOAuthCallback(
        @Query() { code, state }: HandleOAuthCallback,
        @Session() session: any
    ) {
        if (!this.cryptoService.validateState(state, session.state)) {
            throw new HttpException('Invalid state', HttpStatus.FORBIDDEN)
        }
        const userInfo = await this.oAuthService.handleOAuth2Callback(
            OAUTH_PROVIDERS.GOOGLE,
            code
        )
        const jwt = await this.authService.generateJwt(
            userInfo.id,
            OAUTH_PROVIDERS.GOOGLE
        )
        return { jwt }
    }
}
