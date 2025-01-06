import { Test, TestingModule } from '@nestjs/testing';
import { AuthGoogleController } from './auth-google.controller';
import { OAuthService } from '../auth/oAuth.service';
import { CryptoUtilsService } from '../utils/crypto-utils.service';
import { HttpStatus, ForbiddenException } from '@nestjs/common';
import { AUTH_PROVIDERS } from '../auth/constants/provider.constants';

describe('AuthGoogleController', () => {
    let controller: AuthGoogleController;
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
            controllers: [AuthGoogleController],
            providers: [
                { provide: CryptoUtilsService, useValue: mockCryptoService },
                { provide: OAuthService, useValue: mockOAuthService },
            ],
        }).compile();

        controller = module.get<AuthGoogleController>(AuthGoogleController);
    });

    describe('redirectToGoogle', () => {
        it('should redirect to Google authentication URL', () => {
            mockCryptoService.generateState.mockReturnValue('mock-state');
            mockOAuthService.generateRedirectUrl.mockReturnValue('mock-url');
            const mockSession = { state: null };
            const result = controller.redirectToGoogle(mockSession);
            expect(result).toEqual({
                url: 'mock-url',
                statusCode: HttpStatus.FOUND,
            });
            expect(mockSession.state).toEqual('mock-state');
            expect(mockCryptoService.generateState).toHaveBeenCalled();
            expect(mockOAuthService.generateRedirectUrl).toHaveBeenCalledWith(
                AUTH_PROVIDERS.GOOGLE,
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
                AUTH_PROVIDERS.GOOGLE
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
