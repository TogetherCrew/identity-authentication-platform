// test/auth/auth.google.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGoogleController } from './auth-google.controller';
import { OAuthService } from '../auth/oAuth.service';
import { AuthService } from '../auth/auth.service';
import { CryptoUtilsService } from '../utils/crypto-utils.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { OAUTH_PROVIDERS } from '../auth/constants/oAuth.constants';

describe('AuthGoogleController', () => {
  let controller: AuthGoogleController;

  const mockOAuthService = {
    generateRedirectUrl: jest.fn().mockReturnValue('mock-url'),
    handleOAuth2Callback: jest.fn().mockResolvedValue({ id: 'user-id' }),
  };
  const mockAuthService = {
    generateJwt: jest.fn().mockResolvedValue('mock-jwt'),
  };
  const mockCryptoService = {
    generateState: jest.fn().mockReturnValue('mock-state'),
    validateState: jest.fn().mockReturnValue(true),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthGoogleController],
      providers: [
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
    }).compile();

    controller = module.get<AuthGoogleController>(AuthGoogleController);
  });

  describe('redirectToDiscord', () => {
    it('should redirect to Discord authentication URL', () => {
      const mockSession = { state: null };
      const result = controller.redirectToGoogle(mockSession);
      expect(result).toEqual({ url: 'mock-url', statusCode: HttpStatus.FOUND });
      expect(mockSession.state).toEqual('mock-state');
      expect(mockCryptoService.generateState).toHaveBeenCalled();
      expect(mockOAuthService.generateRedirectUrl).toHaveBeenCalledWith(OAUTH_PROVIDERS.GOOGLE, 'mock-state');
    });
  });

  describe('handleOAuthCallback', () => {
    it('should handle OAuth callback successfully', async () => {
      const mockSession = { state: 'mock-state' };
      const result = await controller.handleOAuthCallback({ code: 'valid-code', state: 'mock-state' }, mockSession);
      expect(result).toEqual({ jwt: 'mock-jwt' });
      expect(mockCryptoService.validateState).toHaveBeenCalledWith('mock-state', 'mock-state');
      expect(mockOAuthService.handleOAuth2Callback).toHaveBeenCalledWith(OAUTH_PROVIDERS.GOOGLE, 'valid-code');
      expect(mockAuthService.generateJwt).toHaveBeenCalledWith('user-id', OAUTH_PROVIDERS.GOOGLE);
    });

    it('should throw HttpException if state is invalid', async () => {
      const mockSession = { state: 'different-state' };
      mockCryptoService.validateState.mockReturnValue(false);
      await expect(controller.handleOAuthCallback({ code: 'valid-code', state: 'mock-state' }, mockSession)).rejects.toThrow(
        new HttpException('Invalid state', HttpStatus.FORBIDDEN),
      );
    });
  });
});
