import { Test, TestingModule } from '@nestjs/testing'
import { AuthGoogleService } from './auth-google.service'
import { OAuthService } from '../auth/oAuth.service'
import { AuthService } from '../auth/auth.service'
import { CryptoUtilsService } from '../utils/crypto-utils.service'
import { ForbiddenException } from '@nestjs/common'
import { AUTH_PROVIDERS } from '../auth/constants/provider.constants'

describe('AuthGoogleService', () => {
    let service: AuthGoogleService

    const mockOAuthService = {
        handleOAuth2Callback: jest.fn().mockResolvedValue({ id: 'user-id' }),
    }
    const mockAuthService = {
        generateJwt: jest.fn().mockResolvedValue('mock-jwt'),
    }
    const mockCryptoService = {
        validateState: jest.fn().mockReturnValue(true),
    }

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthGoogleService,
                {
                    provide: OAuthService,
                    useValue: mockOAuthService,
                },
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
                {
                    provide: CryptoUtilsService,
                    useValue: mockCryptoService,
                },
            ],
        }).compile()

        service = module.get<AuthGoogleService>(AuthGoogleService)
    })

    describe('handleOAuthCallback', () => {
        it('should handle OAuth callback successfully', async () => {
            const result = await service.handleOAuthCallback(
                'valid-code',
                'mock-state',
                'mock-state'
            )
            expect(result).toEqual({ jwt: 'mock-jwt' })
            expect(mockCryptoService.validateState).toHaveBeenCalledWith(
                'mock-state',
                'mock-state'
            )
            expect(mockOAuthService.handleOAuth2Callback).toHaveBeenCalledWith(
                AUTH_PROVIDERS.GOOGLE,
                'valid-code'
            )
            expect(mockAuthService.generateJwt).toHaveBeenCalledWith(
                'user-id',
                AUTH_PROVIDERS.GOOGLE
            )
        })

        it('should throw ForbiddenException if state is invalid', async () => {
            mockCryptoService.validateState.mockReturnValue(false)
            await expect(
                service.handleOAuthCallback(
                    'valid-code',
                    'mock-state',
                    'invalid-state'
                )
            ).rejects.toThrow(new ForbiddenException('Invalid state'))
        })
    })
})
