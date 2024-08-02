import { Test, TestingModule } from '@nestjs/testing'
import { AuthGoogleController } from './auth-google.controller'
import { OAuthService } from '../auth/oAuth.service'
import { CryptoUtilsService } from '../utils/crypto-utils.service'
import { AuthGoogleService } from './auth-google.service'
import { HttpStatus, ForbiddenException } from '@nestjs/common'
import { AUTH_PROVIDERS } from '../auth/constants/provider.constants'

describe('AuthGoogleController', () => {
    let controller: AuthGoogleController

    const mockOAuthService = {
        generateRedirectUrl: jest.fn().mockReturnValue('mock-url'),
        handleOAuth2Callback: jest.fn().mockResolvedValue({ id: 'user-id' }),
    }
    const mockCryptoService = {
        generateState: jest.fn().mockReturnValue('mock-state'),
        validateState: jest.fn().mockReturnValue(true),
    }
    const mockAuthGoogleService = {
        handleOAuthCallback: jest.fn().mockResolvedValue('mock-redirect-url'),
    }

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthGoogleController],
            providers: [
                {
                    provide: OAuthService,
                    useValue: mockOAuthService,
                },
                {
                    provide: CryptoUtilsService,
                    useValue: mockCryptoService,
                },
                {
                    provide: AuthGoogleService,
                    useValue: mockAuthGoogleService,
                },
            ],
        }).compile()

        controller = module.get<AuthGoogleController>(AuthGoogleController)
    })

    describe('redirectToGoogle', () => {
        it('should redirect to Google authentication URL', () => {
            const mockSession = { state: null }
            const result = controller.redirectToGoogle(mockSession)
            expect(result).toEqual({
                url: 'mock-url',
                statusCode: HttpStatus.FOUND,
            })
            expect(mockSession.state).toEqual('mock-state')
            expect(mockCryptoService.generateState).toHaveBeenCalled()
            expect(mockOAuthService.generateRedirectUrl).toHaveBeenCalledWith(
                AUTH_PROVIDERS.GOOGLE,
                'mock-state'
            )
        })
    })

    describe('handleOAuthCallback', () => {
        it('should handle OAuth callback successfully', async () => {
            const mockSession = { state: 'mock-state' }
            const result = await controller.handleOAuthCallback(
                { code: 'valid-code', state: 'mock-state' },
                mockSession
            )
            expect(result).toEqual({
                url: 'mock-redirect-url',
                statusCode: HttpStatus.FOUND,
            })
            expect(
                mockAuthGoogleService.handleOAuthCallback
            ).toHaveBeenCalledWith('valid-code', 'mock-state', 'mock-state')
        })

        it('should throw HttpException if state is invalid', async () => {
            const mockSession = { state: 'different-state' }
            mockCryptoService.validateState.mockReturnValue(false)
            mockAuthGoogleService.handleOAuthCallback.mockImplementation(() => {
                throw new ForbiddenException('Invalid state')
            })
            await expect(
                controller.handleOAuthCallback(
                    { code: 'valid-code', state: 'mock-state' },
                    mockSession
                )
            ).rejects.toThrow(ForbiddenException)
        })
    })
})
