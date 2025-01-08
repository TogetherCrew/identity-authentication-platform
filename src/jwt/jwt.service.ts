import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
    AuthJwtPayload,
    JwtPayload,
    VerificationJwtPayload,
} from './types/jwt-payload.type';

@Injectable()
export class JwtService {
    constructor(
        private readonly configService: ConfigService,
        @InjectPinoLogger(JwtService.name)
        private readonly logger: PinoLogger
    ) {}

    async signPayload(payload: JwtPayload): Promise<string> {
        return jwt.sign(payload, this.configService.get<string>('jwt.secret'), {
            algorithm: 'HS256',
        });
    }

    async validateToken(token: string): Promise<JwtPayload> {
        try {
            return jwt.verify(
                token,
                this.configService.get<string>('jwt.secret'),
                {
                    algorithms: ['HS256'],
                }
            ) as JwtPayload;
        } catch (error) {
            this.logger.error(error, 'Failed to validate token');
            throw new UnauthorizedException('Invalid tokengit ad');
        }
    }

    async generateAuthJwt(
        identifier: string,
        provider: string,
        metadata?: Record<string, any>
    ): Promise<string> {
        const now = moment().unix();
        const exp = moment()
            .add(this.configService.get<string>('jwt.authExpiresIn'), 'minutes')
            .unix();

        const payload: AuthJwtPayload = {
            sub: identifier,
            provider,
            iat: now,
            exp,
            iss: this.configService.get<string>('wallet.publicKey'),
            metadata,
        };

        return this.signPayload(payload);
    }

    async generateVerificationToken(verificationCode: string): Promise<string> {
        const now = moment().unix();
        const exp = moment()
            .add(this.configService.get<string>('jwt.authExpiresIn'), 'minutes')
            .unix();

        const payload: VerificationJwtPayload = {
            sub: 'Verification',
            code: verificationCode,
            iat: now,
            exp,
            iss: this.configService.get<string>('wallet.publicKey'),
        };

        return this.signPayload(payload);
    }
}
