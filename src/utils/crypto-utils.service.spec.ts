// src/utils/crypto-utils.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CryptoUtilsService } from './crypto-utils.service';
import { EncodeUtilsService } from './encode-utils.service';

describe('CryptoUtilsService', () => {
  let service: CryptoUtilsService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoUtilsService, EncodeUtilsService],
    }).compile();

    service = module.get<CryptoUtilsService>(CryptoUtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('generateState should return a 32-character hex string', () => {
    const state = service.generateState();
    expect(state).toHaveLength(32);
    expect(typeof state).toBe('string');
  });

  it('generateCodeVerifier should return a 64-character hex string', () => {
    const verifier = service.generateCodeVerifier();
    expect(verifier).toHaveLength(64);
    expect(typeof verifier).toBe('string');
  });

  it('generateCodeChallenge should produce a URL-safe base64-encoded SHA256 hash', () => {
    const verifier = 'verifier';
    const challenge = service.generateCodeChallenge(verifier);
    expect(typeof challenge).toBe('string');
    expect(challenge).not.toMatch(/[+/=]/);
  });

  it('validateState should return true when states match', () => {
    expect(service.validateState('state1', 'state1')).toBe(true);
  });

  it('validateState should return false when states do not match', () => {
    expect(service.validateState('state1', 'state2')).toBe(false);
  });
});
