// src/utils/encode-utils.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { EncodeUtilsService } from './encode-utils.service';

describe('EncodeUtilsService', () => {
  let service: EncodeUtilsService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncodeUtilsService],
    }).compile();

    service = module.get<EncodeUtilsService>(EncodeUtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should encode buffer to URL-safe base64 string', () => {
    const testBuffer = Buffer.from('NestJS Testing');
    const expectedResult = 'TmVzdEpTIFRlc3Rpbmc'.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const result = service.base64UrlEncode(testBuffer);

    expect(result).toBe(expectedResult);
  });
});
