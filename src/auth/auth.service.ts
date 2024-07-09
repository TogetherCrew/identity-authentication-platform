import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from './types/jwt-payload.type';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  async signPayload(payload: JwtPayload): Promise<string> {
    return jwt.sign(payload, this.configService.get<string>('jwt.secret'), { algorithm: 'HS256' });
  }

  async validateToken(token: string): Promise<JwtPayload> {
    return jwt.verify(token, this.configService.get<string>('jwt.secret'), { algorithms: ['HS256'] }) as JwtPayload;
  }

  async generateJwt(identifier: string, provider: string): Promise<string> {
    const now = moment().unix();
    const expiration = moment().add(this.configService.get<string>('jwt.expiresIn'), 'minutes').unix();
    const payload: JwtPayload = {
      sub: identifier,
      provider,
      iat: now,
      exp: expiration,
      iss: this.configService.get<string>('wallet.publicKey'),
    };
    return this.signPayload(payload);
  }
}
