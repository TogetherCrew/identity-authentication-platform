import {
    Injectable,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common'
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'
import { ConfigService } from '@nestjs/config'
import * as querystring from 'querystring'
import { OAUTH_URLS } from './constants/oAuth.constants'
import { AuthService } from '../auth/auth.service'
import { CryptoUtilsService } from '../utils/crypto-utils.service'
import { AuthProvider } from './types/auth-provider.type'

@Injectable()
export class OAuthService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
        private readonly cryptoService: CryptoUtilsService,
        @InjectPinoLogger(OAuthService.name)
        private readonly logger: PinoLogger
    ) {}

    getTokenUrl(provider: AuthProvider): string {
        return OAUTH_URLS[provider].tokenUrl
    }

    getUserInfoUrl(provider: AuthProvider): string {
        return OAUTH_URLS[provider].userInfoUrl
    }

    getOAuthBaseURL(provider: AuthProvider): string {
        return OAUTH_URLS[provider].authUrl
    }

    generateRedirectUrl(provider: AuthProvider, state: string): string {
        const params = {
            client_id: this.configService.get<string>(`${provider}.clientId`),
            redirect_uri: this.configService.get<string>(
                `${provider}.redirectUri`
            ),
            response_type: 'code',
            scope: this.configService.get<string>(`${provider}.scopes`),
            state,
        }
        const baseUrl = this.getOAuthBaseURL(provider)
        const queryParams = new URLSearchParams(params).toString()
        return `${baseUrl}?${queryParams}`
    }

    async exchangeCodeForToken(
        provider: AuthProvider,
        code: string
    ): Promise<{ access_token: string }> {
        const clientId = this.configService.get<string>(`${provider}.clientId`)
        const clientSecret = this.configService.get<string>(
            `${provider}.clientSecret`
        )
        const redirectUri = this.configService.get<string>(
            `${provider}.redirectUri`
        )

        const params = new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
        }).toString()

        const tokenUrl = this.getTokenUrl(provider)
        try {
            const response = await lastValueFrom(
                this.httpService.post(tokenUrl, params, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                })
            )
            return response.data
        } catch (error) {
            this.logger.error(
                error,
                `Failed to exchange ${provider} code for token`
            )
            throw new BadRequestException(
                `Failed to exchange ${provider} code for token`
            )
        }
    }

    async getUserInfo(
        provider: AuthProvider,
        accessToken: string
    ): Promise<any> {
        const userInfoUrl = this.getUserInfoUrl(provider)

        try {
            const response = await lastValueFrom(
                this.httpService.get(userInfoUrl, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
            )
            return response.data
        } catch (error) {
            this.logger.error(
                error,
                `Failed to retrieve user information from ${provider}`
            )
            throw new BadRequestException(
                `Failed to retrieve user information from ${provider}`
            )
        }
    }

    async handleOAuth2Callback(
        state: string,
        sessionState: string,
        code: string,
        provider: AuthProvider
    ) {
        if (!this.cryptoService.validateState(state, sessionState)) {
            throw new ForbiddenException('Invalid state')
        }
        const tokenData = await this.exchangeCodeForToken(provider, code)

        const userInfo = await this.getUserInfo(
            provider,
            tokenData.access_token
        )
        const jwt = await this.authService.generateJwt(userInfo.id, provider)
        const frontendUrl = this.configService.get<string>('app.frontEndURL')
        const params = querystring.stringify({ jwt })
        return `${frontendUrl}/callback?${params}`
    }
}
