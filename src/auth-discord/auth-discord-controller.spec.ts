import { Test, TestingModule } from '@nestjs/testing'
import { AuthDiscordController } from './auth-discord.controller'
import { OAuthService } from '../auth/oAuth.service'
import { CryptoUtilsService } from '../utils/crypto-utils.service'
import { HttpStatus, ForbiddenException } from '@nestjs/common'
import { AUTH_PROVIDERS } from '../auth/constants/provider.constants'
import { AuthDiscordService } from './auth-discord.service'

describe('AuthDiscordController', () => {
    let controller: AuthDiscordController

    const mockOAuthService = {
        generateRedirectUrl: jest.fn().mockReturnValue('mock-url'),
        handleOAuth2Callback: jest.fn().mockResolvedValue({ id: 'user-id' }),
    }
    const mockCryptoService = {
        generateState: jest.fn().mockReturnValue('mock-state'),
        validateState: jest.fn().mockReturnValue(true),
    }
    const mockAuthDiscordService = {
        handleOAuthCallback: jest.fn().mockResolvedValue('mock-redirect-url'),
    }

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthDiscordController],
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
                    provide: AuthDiscordService,
                    useValue: mockAuthDiscordService,
                },
            ],
        }).compile()

        controller = module.get<AuthDiscordController>(AuthDiscordController)
    })

    describe('redirectToDiscord', () => {
        it('should redirect to Discord authentication URL', () => {
            const mockSession = { state: null }
            const result = controller.redirectToDiscord(mockSession)
            expect(result).toEqual({
                url: 'mock-url',
                statusCode: HttpStatus.FOUND,
            })
            expect(mockSession.state).toEqual('mock-state')
            expect(mockCryptoService.generateState).toHaveBeenCalled()
            expect(mockOAuthService.generateRedirectUrl).toHaveBeenCalledWith(
                AUTH_PROVIDERS.DISCORD,
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
                mockAuthDiscordService.handleOAuthCallback
            ).toHaveBeenCalledWith('valid-code', 'mock-state', 'mock-state')
        })

        it('should throw HttpException if state is invalid', async () => {
            const mockSession = { state: 'different-state' }
            mockCryptoService.validateState.mockReturnValue(false)
            mockAuthDiscordService.handleOAuthCallback.mockImplementation(
                () => {
                    throw new ForbiddenException('Invalid state')
                }
            )
            await expect(
                controller.handleOAuthCallback(
                    { code: 'valid-code', state: 'mock-state' },
                    mockSession
                )
            ).rejects.toThrow(ForbiddenException)
        })
    })
})
