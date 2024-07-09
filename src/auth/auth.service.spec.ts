// test/auth/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../src/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import { JwtPayload } from './types/jwt-payload.type';
import * as jwt from 'jsonwebtoken';

describe('AuthService', () => {
  let service: AuthService;
  const mockPublicKey = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef';
  const mockJwtSecret = 'jwtSecret';
  const mockJwtExpiresIn = '60';

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'wallet.publicKey') return mockPublicKey;
              if (key === 'jwt.secret') return mockJwtSecret;
              if (key === 'jwt.expiresIn') return mockJwtExpiresIn;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signPayload', () => {
    it('should return a valid JWT', async () => {
      const payload: JwtPayload = {
        sub: '1',
        provider: 'google',
        iat: moment().unix(),
        exp: moment().add(mockJwtExpiresIn, 'minutes').unix(),
        iss: mockPublicKey,
      };
      const token = await service.signPayload(payload);
      expect(typeof token).toBe('string');
      const decoded = jwt.verify(token, mockJwtSecret, { algorithms: ['HS256'] });
      expect(decoded).toMatchObject(payload);
    });
  });

  describe('validateToken', () => {
    it('should validate a token correctly', async () => {
      const payload: JwtPayload = {
        sub: '1',
        provider: 'google',
        iat: moment().unix(),
        exp: moment().add(mockJwtExpiresIn, 'minutes').unix(),
        iss: mockPublicKey,
      };
      const token = jwt.sign(payload, mockJwtSecret, { algorithm: 'HS256' });
      const decoded = await service.validateToken(token);
      expect(decoded).toMatchObject(payload);
    });

    it('should return null if token is invalid', async () => {
      await expect(service.validateToken('invalid.token.here')).rejects.toThrow(jwt.JsonWebTokenError);
    });
  });
});
