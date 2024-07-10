import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { AuthCoreService } from 'src/auth/auth.core.service';
import { AuthService } from 'src/auth/auth.service';
@Injectable()
export class AuthDiscordService {
  private readonly logger = new Logger(AuthDiscordService.name);
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly scopes: string;
  constructor(
    private readonly httpService: HttpService,
    private authCoreService: AuthCoreService,
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.clientId = configService.get<string>('discord.clientId');
    this.clientSecret = configService.get<string>('discord.clientSecret');
    this.redirectUri = configService.get<string>('discord.redirectUri');
    this.scopes = configService.get<string>('discord.scopes');
  }

  redirectToDiscord(): string {
    const state = this.authCoreService.generateState();
    const params = {
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: this.scopes,
      state: state,
    };
    return this.authCoreService.generateOAuthUrl('discord', params);
  }
  async handleOAuth2Callback(code: string): Promise<string> {
    try {
      const tokenData = await this.exchangeCodeForToken(code);
      const userInfo = await this.getUserInfo(tokenData.access_token);
      return await this.authService.generateJwt(userInfo.id, 'discord');
    } catch (error) {
      this.logger.error('Error handling OAuth2 callback', { error });
      throw new HttpException('Failed to handle OAuth2 callback', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async exchangeCodeForToken(code: string): Promise<{ access_token: string }> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.redirectUri,
    }).toString();
    try {
      const response = await lastValueFrom(
        this.httpService.post('https://discord.com/api/oauth2/token', params, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to exchange Discord code for token', { error });
      throw new HttpException('Failed to exchange Discord code', HttpStatus.BAD_REQUEST);
    }
  }

  async getUserInfo(accessToken: string): Promise<{ id: string; username: string }> {
    try {
      const response = await lastValueFrom(
        this.httpService.get('https://discord.com/api/users/@me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to retrieve user information from Discord', { error });
      throw new HttpException('Failed to retrieve user information from Discord', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
