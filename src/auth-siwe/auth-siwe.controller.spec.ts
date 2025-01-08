import { parseSiweMessage } from 'viem/siwe';

import { Test, TestingModule } from '@nestjs/testing';

import { AUTH_PROVIDERS } from '../auth/constants/provider.constants';
import { JwtService } from '../jwt/jwt.service';
import { AuthSiweController } from './auth-siwe.controller';
import { VerifySiweDto } from './dto/verify-siwe.dto';
import { SiweService } from './siwe.service';

jest.mock('viem/siwe', () => ({
    parseSiweMessage: jest.fn(),
}));

describe('AuthSiweController', () => {
    let controller: AuthSiweController;
    let siweService: SiweService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthSiweController],
            providers: [
                {
                    provide: SiweService,
                    useValue: {
                        getNonce: jest.fn(),
                        verifySiweMessage: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        generateAuthJwt: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<AuthSiweController>(AuthSiweController);
        siweService = module.get<SiweService>(SiweService);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getNonce', () => {
        it('should return a nonce', () => {
            const nonce = 'nonce';
            jest.spyOn(siweService, 'getNonce').mockReturnValue(nonce);

            expect(controller.getNonce()).toEqual({ nonce });
        });
    });

    describe('verifySiwe', () => {
        it('should verify SIWE message and return a JWT', async () => {
            const verifySiweDto: VerifySiweDto = {
                message: '0xmessage',
                signature: '0xsignature',
                chainId: 1,
            };
            const jwt = 'jwt';
            const address = '0xaddress';

            jest.spyOn(siweService, 'verifySiweMessage').mockResolvedValue(
                undefined
            );
            jest.spyOn(jwtService, 'generateAuthJwt').mockResolvedValue(jwt);
            (parseSiweMessage as jest.Mock).mockReturnValue({ address });

            const result = await controller.verifySiwe(verifySiweDto);

            expect(result).toEqual({ jwt });
            expect(siweService.verifySiweMessage).toHaveBeenCalledWith(
                verifySiweDto.message,
                verifySiweDto.signature,
                verifySiweDto.chainId
            );
            expect(jwtService.generateAuthJwt).toHaveBeenCalledWith(
                address,
                AUTH_PROVIDERS.SIWE
            );
        });
    });
});
