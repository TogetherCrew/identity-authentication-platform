// test/auth/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { ConfigService } from '@nestjs/config'
import * as moment from 'moment'
import { JwtPayload } from './types/jwt.type'
import * as jwt from 'jsonwebtoken'
import { PinoLogger, LoggerModule } from 'nestjs-pino'
import { UnauthorizedException } from '@nestjs/common'
import { JWT_TYPES } from './constants/jwt.constants'
import { privateKeyToAddress } from 'viem/accounts'

const mockPrivateKey =
    '0xa45f7276817eea015efd2900aafaa1b500b00cce790fca8222bb499c5fc96531'
const mockJwtSecret = 'jwtSecret'
const mockJwtAlgorithm = 'HS256'
const mockJwtUserExpirationMinutes = '60'
const mockJwtdiscourseVerificationExpirationMinutes = '10'

const mockConfigService = {
    get: jest.fn((key: string) => {
        if (key === 'wallet.privateKey') return mockPrivateKey
        if (key === 'jwt.secret') return mockJwtSecret
        if (key === 'jwt.algorithm') return mockJwtAlgorithm
        if (key === 'jwt.userExpirationMinutes')
            return mockJwtUserExpirationMinutes
        if (key === 'jwt.discourseVerificationExpirationMinutes')
            return mockJwtdiscourseVerificationExpirationMinutes
    }),
}

describe('AuthService', () => {
    let service: AuthService
    let loggerMock: PinoLogger

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [LoggerModule.forRoot()],
            providers: [
                AuthService,
                JwtService,
                { provide: ConfigService, useValue: mockConfigService },
                { provide: ConfigService, useValue: mockConfigService },
                { provide: PinoLogger, useValue: loggerMock },
            ],
        }).compile()

        service = module.get<AuthService>(AuthService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('signPayload', () => {
        it('should return a valid JWT', async () => {
            const payload: JwtPayload = {
                type: JWT_TYPES.USER,
                sub: '1',
                provider: 'google',
                iat: moment().unix(),
                exp: moment()
                    .add(mockJwtUserExpirationMinutes, 'minutes')
                    .unix(),
                iss: privateKeyToAddress(mockPrivateKey),
            }
            const token = await service.signPayload(payload)
            expect(typeof token).toBe('string')
            const decoded = jwt.verify(token, mockJwtSecret, {
                algorithms: [mockJwtAlgorithm],
            })
            expect(decoded).toMatchObject(payload)
        })
    })

    describe('validateToken', () => {
        it('should validate a token correctly', async () => {
            const payload: JwtPayload = {
                type: JWT_TYPES.USER,
                sub: '1',
                provider: 'google',
                iat: moment().unix(),
                exp: moment()
                    .add(mockJwtUserExpirationMinutes, 'minutes')
                    .unix(),
                iss: privateKeyToAddress(mockPrivateKey),
            }
            const token = jwt.sign(payload, mockJwtSecret, {
                algorithm: mockJwtAlgorithm,
            })
            const decoded = await service.validateToken(token)
            expect(decoded).toMatchObject(payload)
        })

        it('should return UnauthorizedException if token is invalid', async () => {
            await expect(
                service.validateToken('invalid.token.here')
            ).rejects.toThrow(UnauthorizedException)
        })
    })
})
