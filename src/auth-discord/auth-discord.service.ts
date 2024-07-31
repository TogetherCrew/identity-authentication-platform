import { Injectable, ForbiddenException } from '@nestjs/common'
import { OAuthService } from '../auth/oAuth.service'
import { AuthService } from '../auth/auth.service'
import { CryptoUtilsService } from '../utils/crypto-utils.service'
import { AUTH_PROVIDERS } from '../auth/constants/provider.constants'
import { ConfigService } from '@nestjs/config'
import * as querystring from 'querystring'

@Injectable()
export class AuthDiscordService {
    constructor(
        private readonly oAuthService: OAuthService,
        private readonly authService: AuthService,
        private readonly cryptoService: CryptoUtilsService,
        private readonly configService: ConfigService
    ) {}

    async handleOAuthCallback(
        code: string,
        state: string,
        sessionState: string
    ): Promise<string> {
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
        const frontendUrl = this.configService.get<string>('app.frontEndURL')
        const params = querystring.stringify({ jwt })
        return `${frontendUrl}/callback?${params}`
    }
}
