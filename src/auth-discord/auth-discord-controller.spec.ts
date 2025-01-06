import { Test, TestingModule } from '@nestjs/testing';
import { AuthDiscordController } from './auth-discord.controller';
import { OAuthService } from '../auth/oAuth.service';
import { CryptoUtilsService } from '../utils/crypto-utils.service';
import { HttpStatus, ForbiddenException } from '@nestjs/common';
import { AUTH_PROVIDERS } from '../auth/constants/provider.constants';

describe('AuthDiscordController', () => {
    let controller: AuthDiscordController;

    const mockCryptoService = {
        generateState: jest.fn(),
        validateState: jest.fn(),
    };
    const mockOAuthService = {
        generateRedirectUrl: jest.fn(),
        handleOAuth2Callback: jest.fn(),
    };
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthDiscordController],
            providers: [
                { provide: CryptoUtilsService, useValue: mockCryptoService },
                { provide: OAuthService, useValue: mockOAuthService },
            ],
        }).compile();

        controller = module.get<AuthDiscordController>(AuthDiscordController);
    });

    describe('redirectToDiscord', () => {
        it('should redirect to Discord authentication URL', () => {
            mockCryptoService.generateState.mockReturnValue('mock-state');
            mockOAuthService.generateRedirectUrl.mockReturnValue('mock-url');
            const mockSession = { state: null };
            const result = controller.redirectToDiscord(mockSession);
            expect(result).toEqual({
                url: 'mock-url',
                statusCode: HttpStatus.FOUND,
            });
            expect(mockSession.state).toEqual('mock-state');
            expect(mockCryptoService.generateState).toHaveBeenCalled();
            expect(mockOAuthService.generateRedirectUrl).toHaveBeenCalledWith(
                AUTH_PROVIDERS.DISCORD,
                'mock-state'
            );
        });
    });

    describe('handleOAuthCallback', () => {
        it('should handle OAuth callback successfully', async () => {
            mockOAuthService.handleOAuth2Callback.mockResolvedValue(
                'mock-redirect-url'
            );
            const mockSession = { state: 'mock-state' };
            const result = await controller.handleOAuthCallback(
                { code: 'valid-code', state: 'mock-state' },
                mockSession
            );
            expect(result).toEqual({
                url: 'mock-redirect-url',
                statusCode: HttpStatus.FOUND,
            });
            expect(mockOAuthService.handleOAuth2Callback).toHaveBeenCalledWith(
                'mock-state',
                'mock-state',
                'valid-code',
                AUTH_PROVIDERS.DISCORD
            );
        });
        it('should throw HttpException if state is invalid', async () => {
            const mockSession = { state: 'invalid' };
            mockOAuthService.handleOAuth2Callback.mockImplementation(() => {
                throw new ForbiddenException('Invalid state');
            });
            await expect(
                controller.handleOAuthCallback(
                    { code: 'valid-code', state: 'mock-state' },
                    mockSession
                )
            ).rejects.toThrow(ForbiddenException);
        });
    });
});
