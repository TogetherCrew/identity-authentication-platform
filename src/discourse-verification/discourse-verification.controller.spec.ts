import { AxiosResponse } from 'axios';
import { of } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { JwtService } from '../jwt/jwt.service';
import { CryptoUtilsService } from '../utils/crypto-utils.service';
import { DiscourseVerificationController } from './discourse-verification.controller';
import { DiscourseVerificationService } from './discourse-verification.service';

describe('DiscourseVerificationController', () => {
    let controller: DiscourseVerificationController;
    const mockJwtService = {
        generateAuthJwt: jest.fn().mockResolvedValue('mock-jwt'),
    };
    const mockHttpService = {
        post: jest.fn().mockImplementation(() =>
            of({
                data: { access_token: 'mock-access-token' },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {},
            } as AxiosResponse<{ access_token: string }>)
        ),
        get: jest.fn().mockImplementation(() =>
            of({
                data: { id: 'mock-id' },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {},
            } as AxiosResponse<{ id: string }>)
        ),
    };
    const mockCryptoService = {
        validateState: jest.fn().mockReturnValue(true),
    };
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DiscourseVerificationController],
            providers: [
                { provide: HttpService, useValue: mockHttpService },
                { provide: CryptoUtilsService, useValue: mockCryptoService },
                { provide: JwtService, useValue: mockJwtService },
                DiscourseVerificationService,
            ],
        }).compile();

        controller = module.get<DiscourseVerificationController>(
            DiscourseVerificationController
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
