import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import { Algorithm } from 'jsonwebtoken'
import { JwtPayload, JwtProvider } from './types/jwt.type'
import { ConfigService } from '@nestjs/config'
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino'
import * as moment from 'moment'
import { JWT_TYPES } from './constants/jwt.constants'
import { Address } from 'viem'
import { privateKeyToAddress } from 'viem/accounts'

@Injectable()
export class AuthService {
    private secret: string
    private algorithm: Algorithm
    public userExpirationMinutes: number
    public discourseVerificationExpirationMinutes: number
    public appAddress: Address
    constructor(
        private readonly configService: ConfigService,
        @InjectPinoLogger(AuthService.name)
        private readonly logger: PinoLogger
    ) {
        this.secret = this.configService.get<string>('jwt.secret')
        this.algorithm = this.configService.get<Algorithm>('jwt.algorithm')
        this.userExpirationMinutes = this.configService.get<number>(
            'jwt.userExpirationMinutes'
        )
        this.discourseVerificationExpirationMinutes =
            this.configService.get<number>(
                'jwt.discourseVerificationExpirationMinutes'
            )
        this.appAddress = privateKeyToAddress(
            this.configService.get<'0x${string}'>('wallet.privateKey')
        )
    }

    signPayload(payload: JwtPayload): string {
        return jwt.sign(payload, this.secret, {
            algorithm: this.algorithm,
        })
    }

    validateToken(token: string): JwtPayload {
        try {
            return jwt.verify(token, this.secret, {
                algorithms: [this.algorithm],
            }) as JwtPayload
        } catch (error) {
            this.logger.error(error, `Failed to validtae token`)
            throw new UnauthorizedException(error.message)
        }
    }

    generateUserJWT(identifier: string, provider: JwtProvider): string {
        const now = moment().unix()
        const expiration = moment()
            .add(this.userExpirationMinutes, 'minutes')
            .unix()
        const payload: JwtPayload = {
            type: JWT_TYPES.USER,
            sub: identifier,
            provider,
            iat: now,
            exp: expiration,
            iss: this.appAddress,
        }
        return this.signPayload(payload)
    }

    generateDiscourseVerificationJWT(code: string): string {
        const now = moment().unix()
        const expiration = moment()
            .add(this.discourseVerificationExpirationMinutes, 'minutes')
            .unix()
        const payload: JwtPayload = {
            type: JWT_TYPES.DISCOURSE_VERIFICATION,
            sub: code,
            iat: now,
            exp: expiration,
            iss: this.appAddress,
        }
        return this.signPayload(payload)
    }
}
