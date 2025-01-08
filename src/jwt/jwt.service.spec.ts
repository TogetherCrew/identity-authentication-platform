import { LoggerModule, PinoLogger } from 'nestjs-pino';

import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { JwtService } from './jwt.service';

describe('JwtService', () => {
    let service: JwtService;
    let loggerMock: PinoLogger;

    const mockConfigService = {
        get: jest.fn((key: string) => {
            if (key === 'jwt.secret') return 'test-value';
            return null;
        }),
    };
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [LoggerModule.forRoot()],

            providers: [
                JwtService,
                { provide: ConfigService, useValue: mockConfigService },
                { provide: PinoLogger, useValue: loggerMock },
            ],
        }).compile();

        service = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
