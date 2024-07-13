// test/auth/auth.discord.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthDiscordController } from './auth-discord.controller';
import { OAuthService } from '../auth/oAuth.service';
import { AuthService } from '../auth/auth.service';
import { CryptoUtilsService } from '../utils/crypto-utils.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthDiscordController', () => {
  let controller: AuthDiscordController;

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
      controllers: [AuthDiscordController],
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

    controller = module.get<AuthDiscordController>(AuthDiscordController);
  });

  describe('redirectToDiscord', () => {
    it('should redirect to Discord authentication URL', () => {
      const mockSession = { state: null };
      const result = controller.redirectToDiscord(mockSession);
      expect(result).toEqual({ url: 'mock-url', statusCode: HttpStatus.FOUND });
      expect(mockSession.state).toEqual('mock-state');
      expect(mockCryptoService.generateState).toHaveBeenCalled();
      expect(mockOAuthService.generateRedirectUrl).toHaveBeenCalledWith('discord', 'mock-state');
    });
  });

  describe('handleOAuthCallback', () => {
    it('should handle OAuth callback successfully', async () => {
      const mockSession = { state: 'mock-state' };
      const result = await controller.handleOAuthCallback({ code: 'valid-code', state: 'mock-state' }, mockSession);
      expect(result).toEqual({ jwt: 'mock-jwt' });
      expect(mockCryptoService.validateState).toHaveBeenCalledWith('mock-state', 'mock-state');
      expect(mockOAuthService.handleOAuth2Callback).toHaveBeenCalledWith('discord', 'valid-code');
      expect(mockAuthService.generateJwt).toHaveBeenCalledWith('user-id', 'discord');
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
