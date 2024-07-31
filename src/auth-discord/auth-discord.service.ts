import { Injectable, ForbiddenException } from '@nestjs/common'
import { OAuthService } from '../auth/oAuth.service'
import { AuthService } from '../auth/auth.service'
import { CryptoUtilsService } from '../utils/crypto-utils.service'
import { AUTH_PROVIDERS } from '../auth/constants/provider.constants'
import { JwtResponse } from '../auth/dto/jwt-response.dto'

@Injectable()
export class AuthDiscordService {
    constructor(
        private readonly oAuthService: OAuthService,
        private readonly authService: AuthService,
        private readonly cryptoService: CryptoUtilsService
    ) {}

    async handleOAuthCallback(
        code: string,
        state: string,
        sessionState: string
    ): Promise<JwtResponse> {
        if (!this.cryptoService.validateState(state, sessionState)) {
            throw new ForbiddenException('Invalid state')
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
