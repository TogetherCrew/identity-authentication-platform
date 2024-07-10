import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { OAUTH_URLS } from './constants/oAuth.constants';
@Injectable()
export class AuthCoreService {
  constructor() {}

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

  getOAuthBaseURL(provider: string): string {
    const baseUrl = OAUTH_URLS[provider];
    if (!baseUrl) {
      throw new Error(`OAuth URL for provider '${provider}' is not configured.`);
    }
    return baseUrl;
  }

  generateOAuthUrl(provider: string, params: { [key: string]: any }): string {
    const baseUrl = this.getOAuthBaseURL(provider);
    const queryParams = new URLSearchParams(params).toString();
    return `${baseUrl}?${queryParams}`;
  }

  validateState(returnedState: string, expectedState: string): boolean {
    return returnedState === expectedState;
  }
}
