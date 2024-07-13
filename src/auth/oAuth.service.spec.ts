// test/auth/oAuth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { OAuthService } from './oAuth.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('OAuthService', () => {
  let service: OAuthService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OAuthService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn().mockImplementation(() =>
              of({
                data: { access_token: 'mock-access-token' },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {},
              } as AxiosResponse<{ access_token: string }>),
            ),
            get: jest.fn().mockImplementation(() =>
              of({
                data: { id: 'mock-id' },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {},
              } as AxiosResponse<{ id: string }>),
            ),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key.startsWith('google.')) {
                return 'test-value';
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<OAuthService>(OAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('OAuth token exchange', () => {
    it('should exchange code for token successfully', async () => {
      const result = await service.exchangeCodeForToken('google', 'mock-code');
      expect(result).toEqual({ access_token: 'mock-access-token' });
    });

    // it('should handle errors during token exchange', async () => {
    //   jest.spyOn(httpService, 'post').mockReturnValue(throwError(() => new Error('Request failed')));
    //   await expect(service.exchangeCodeForToken('google', 'mock-code')).rejects.toThrow({});
    // });
  });

  describe('Retrieve user information', () => {
    it('should retrieve user information successfully', async () => {
      const result = await service.getUserInfo('google', 'mock-access-token');
      expect(result).toEqual({ id: 'mock-id' });
    });

    // it('should handle errors during user information retrieval', async () => {
    //   jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => new Error('Request failed')));
    //   await expect(service.getUserInfo('google', 'mock-access-token')).rejects.toThrow('Failed to retrieve user information from google');
    // });
  });

  describe('Handle OAuth2 callback', () => {
    it('should handle OAuth2 callback successfully', async () => {
      jest.spyOn(service, 'exchangeCodeForToken').mockResolvedValue({ access_token: 'valid-token' });
      jest.spyOn(service, 'getUserInfo').mockResolvedValue({ id: 'user-id' });

      const result = await service.handleOAuth2Callback('google', 'valid-code');
      expect(result).toEqual({ id: 'user-id' });
    });

    // it('should handle errors during OAuth2 callback processing', async () => {
    //   jest.spyOn(service, 'exchangeCodeForToken').mockRejectedValue(new Error('Token exchange failed'));
    //   await expect(service.handleOAuth2Callback('google', 'invalid-code')).rejects.toThrow('Failed to handle google OAuth2 callback');
    // });
  });
});
