import * as crypto from 'crypto';

import { Injectable } from '@nestjs/common';

import { verificationConfig } from './config/crypto-utils.config';
import { EncodeUtilsService } from './encode-utils.service';

@Injectable()
export class CryptoUtilsService {
    constructor(private readonly encodeUtils: EncodeUtilsService) {}

    generateState(length: number = 16): string {
        return crypto.randomBytes(length).toString('hex');
    }

    validateState(returnedState: string, expectedState: string): boolean {
        return returnedState === expectedState;
    }

    generateCodeVerifier(length: number = 32): string {
        return crypto.randomBytes(length).toString('hex');
    }

    generateCodeChallenge(verifier: string): string {
        const hash = crypto.createHash('sha256').update(verifier).digest();
        return this.encodeUtils.base64UrlEncode(hash);
    }

    private generateRandomCode(
        length: number,
        allowedCharacters: string
    ): string {
        const charsLength = allowedCharacters.length;
        const randomBytes = crypto.randomBytes(length);
        let code = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = randomBytes[i] % charsLength;
            code += allowedCharacters.charAt(randomIndex);
        }
        return code;
    }

    public generateVerificationCode(): string {
        const { length, allowedCharacters } = verificationConfig;
        return this.generateRandomCode(length, allowedCharacters);
    }
}
