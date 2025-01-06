// src/utils/crypto-utils.service.ts
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
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
}
