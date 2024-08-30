import { Test, TestingModule } from '@nestjs/testing'
import { OAuthService } from './oAuth.service'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { of } from 'rxjs'
import { AxiosResponse } from 'axios'
import { CryptoUtilsService } from '../utils/crypto-utils.service'
import { AuthService } from './auth.service'
import { PinoLogger, LoggerModule } from 'nestjs-pino'
import { OAUTH_METHODS } from './constants/auth.constants'

describe('OAuthService', () => {
    let service: OAuthService
    let loggerMock: PinoLogger

    const mockHttpService = {
        post: jest.fn().mockImplementation(() =>
            of({
                data: { access_token: 'mock-access-token' },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {},
            } as AxiosResponse<{ access_token: string }>)
        ),
        get: jest.fn().mockImplementation(() =>
            of({
                data: { id: 'mock-id' },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {},
            } as AxiosResponse<{ id: string }>)
        ),
    }
    const mockFrontEndURL = 'http://localhost:3000'

    const mockConfigService = {
        get: jest.fn((key: string) => {
            if (key.startsWith('google.')) {
                return 'test-value'
            }
            if (key === 'app.frontEndURL') return mockFrontEndURL
            return null
        }),
    }

    const mockAuthService = {
        generateUserJWT: jest.fn().mockResolvedValue('mock-jwt'),
    }

    const mockCryptoService = {
        validateState: jest.fn().mockReturnValue(true),
    }

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [LoggerModule.forRoot()],
            providers: [
                OAuthService,
                { provide: AuthService, useValue: mockAuthService },
                { provide: HttpService, useValue: mockHttpService },
                { provide: ConfigService, useValue: mockConfigService },
                { provide: CryptoUtilsService, useValue: mockCryptoService },
                { provide: PinoLogger, useValue: loggerMock },
            ],
        }).compile()

        service = module.get<OAuthService>(OAuthService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('OAuth token exchange', () => {
        it('should exchange code for token successfully', async () => {
            const result = await service.exchangeCodeForToken(
                OAUTH_METHODS.GOOGLE,
                'mock-code'
            )
            expect(result).toEqual({ access_token: 'mock-access-token' })
        })
        // it('should handle errors during token exchange', async () => {
        //   jest.spyOn(httpService, 'post').mockReturnValue(throwError(() => new Error('Request failed')));
        //   await expect(service.exchangeCodeForToken('google', 'mock-code')).rejects.toThrow({});
        // });
    })

    describe('Retrieve user information', () => {
        it('should retrieve user information successfully', async () => {
            const result = await service.getUserInfo(
                OAUTH_METHODS.GOOGLE,
                'mock-access-token'
            )
            expect(result).toEqual({ id: 'mock-id' })
        })
        // it('should handle errors during user information retrieval', async () => {
        //   jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => new Error('Request failed')));
        //   await expect(service.getUserInfo('google', 'mock-access-token')).rejects.toThrow('Failed to retrieve user information from google');
        // });
    })

    describe('Handle OAuth2 callback', () => {
        it('should handle OAuth2 callback successfully', async () => {
            jest.spyOn(service, 'exchangeCodeForToken').mockResolvedValue({
                access_token: 'valid-token',
            })
            jest.spyOn(service, 'getUserInfo').mockResolvedValue({
                id: 'user-id',
            })
            const result = await service.handleOAuth2Callback(
                'mock-state',
                'mock-state',
                'valid-code',
                OAUTH_METHODS.GOOGLE
            )
            console.log('result', result)
            expect(mockAuthService.generateUserJWT).toHaveBeenCalledWith(
                'user-id',
                OAUTH_METHODS.GOOGLE
            )
            expect(result).toEqual(
                'http://localhost:3000/callback?jwt=mock-jwt'
            )
            expect(mockCryptoService.validateState).toHaveBeenCalledWith(
                'mock-state',
                'mock-state'
            )
            expect(mockAuthService.generateUserJWT).toHaveBeenCalledWith(
                'user-id',
                OAUTH_METHODS.GOOGLE
            )
        })
        // it('should handle errors during OAuth2 callback processing', async () => {
        //   jest.spyOn(service, 'exchangeCodeForToken').mockRejectedValue(new Error('Token exchange failed'));
        //   await expect(service.handleOAuth2Callback('google', 'invalid-code')).rejects.toThrow('Failed to handle google OAuth2 callback');
        // });
    })
})
