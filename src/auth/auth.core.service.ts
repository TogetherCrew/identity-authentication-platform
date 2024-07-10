import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthCoreService {
  constructor(private configService: ConfigService) {}

  generateState(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  generateCodeVerifier(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  generateCodeChallenge(verifier: string): string {
    const hash = crypto.createHash('sha256').update(verifier).digest();
    return this.base64UrlEncode(hash);
  }

  base64UrlEncode(buffer: Buffer): string {
    return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  generateOAuthUrl(platform: string, params: { [key: string]: any }): string {
    const baseUrl = this.configService.get<string>(`${platform}.authUrl`);
    const clientId = this.configService.get<string>(`${platform}.clientId`);
    const queryParams = new URLSearchParams({
      client_id: clientId,
      ...params,
    }).toString();
    return `${baseUrl}?${queryParams}`;
  }

  validateState(returnedState: string, expectedState: string): boolean {
    return returnedState === expectedState;
  }
}
