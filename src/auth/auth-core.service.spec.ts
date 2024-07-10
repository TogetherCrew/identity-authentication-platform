// test/auth/auth-core.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthCoreService } from './auth.core.service';
import { ConfigService } from '@nestjs/config';

describe('AuthCoreService', () => {
  let service: AuthCoreService;
  const mockBaseUrl = 'https://auth.example.com';
  const mockClientId = 'client-id';

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthCoreService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'discord.authUrl') return mockBaseUrl;
              if (key === 'discord.clientId') return mockClientId;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthCoreService>(AuthCoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateState', () => {
    it('should generate a non-empty string', () => {
      const state = service.generateState();
      expect(typeof state).toBe('string');
      expect(state).not.toBe('');
    });
  });

  describe('generateCodeVerifier', () => {
    it('should generate a non-empty string', () => {
      const verifier = service.generateCodeVerifier();
      expect(typeof verifier).toBe('string');
      expect(verifier).not.toBe('');
    });
  });

  describe('generateCodeChallenge', () => {
    it('should return a base64 URL encoded string', () => {
      const verifier = service.generateCodeVerifier();
      const challenge = service.generateCodeChallenge(verifier);
      expect(typeof challenge).toBe('string');
      expect(challenge).toMatch(/^[A-Za-z0-9\-_]+$/);
    });
  });

  describe('generateOAuthUrl', () => {
    it('should construct a valid OAuth URL with provided parameters', () => {
      const params = {
        redirect_uri: 'https://myapp.com/callback',
        response_type: 'code',
        scope: 'email',
        state: 'state123',
      };
      const url = service.generateOAuthUrl('discord', params);
      expect(url).toBe(`${mockBaseUrl}?client_id=${mockClientId}&redirect_uri=${encodeURIComponent(params.redirect_uri)}&response_type=code&scope=email&state=state123`);
    });
  });

  describe('validateState', () => {
    it('should return true for matching states', () => {
      expect(service.validateState('abc123', 'abc123')).toBe(true);
    });

    it('should return false for non-matching states', () => {
      expect(service.validateState('abc123', 'xyz789')).toBe(false);
    });
  });
});
