import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'
import { ConfigService } from '@nestjs/config'

import { OAUTH_URLS } from './constants/oAuth.constants'

@Injectable()
export class OAuthService {
    private readonly logger = new Logger(OAuthService.name)
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {}

    getTokenUrl(provider: string): string {
        return OAUTH_URLS[provider].tokenUrl
    }

    getUserInfoUrl(provider: string): string {
        return OAUTH_URLS[provider].userInfoUrl
    }

    getOAuthBaseURL(provider: string): string {
        return OAUTH_URLS[provider].authUrl
    }

    generateRedirectUrl(provider: string, state: string): string {
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
        provider: string,
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
            this.logger.error(`Failed to exchange ${provider} code for token`, {
                error,
            })
            throw new HttpException(
                `Failed to exchange ${provider} code for token`,
                HttpStatus.BAD_REQUEST
            )
        }
    }

    async getUserInfo(provider: string, accessToken: string): Promise<any> {
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
                `Failed to retrieve user information from ${provider}`,
                { error }
            )
            throw new HttpException(
                `Failed to retrieve user information from ${provider}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async handleOAuth2Callback(provider: string, code: string): Promise<any> {
        try {
            const tokenData = await this.exchangeCodeForToken(provider, code)
            const userInfo = await this.getUserInfo(
                provider,
                tokenData.access_token
            )
            return userInfo
        } catch (error) {
            this.logger.error(
                `Error handling ${provider} OAuth2 callback`,
                error
            )
            throw new HttpException(
                `Failed to handle ${provider} OAuth2 callback`,
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}
