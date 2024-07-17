import { Test, TestingModule } from '@nestjs/testing'
import { AuthSiweController } from './auth-siwe.controller'
import { SiweService } from './siwe.service'
import { AuthService } from '../auth/auth.service'
import { VerifySiweDto } from './dto/verify-siwe.dto'
import { AUTH_PROVIDERS } from '../auth/constants/provider.constants'

describe('AuthSiweController', () => {
    let controller: AuthSiweController
    let siweService: SiweService
    let authService: AuthService

    const mockSiweService = {
        createNonce: jest.fn().mockReturnValue('mock-nonce'),
        verifySiweMessage: jest.fn().mockResolvedValue({ address: '0x123' }),
    }

    const mockAuthService = {
        generateJwt: jest.fn().mockResolvedValue('mock-jwt'),
    }

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthSiweController],
            providers: [
                {
                    provide: SiweService,
                    useValue: mockSiweService,
                },
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile()

        controller = module.get<AuthSiweController>(AuthSiweController)
        siweService = module.get<SiweService>(SiweService)
        authService = module.get<AuthService>(AuthService)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    describe('getNonce', () => {
        it('should return a nonce', () => {
            const result = controller.getNonce()
            expect(result).toBe('mock-nonce')
            expect(siweService.createNonce).toHaveBeenCalled()
        })
    })

    describe('verifySiwe', () => {
        it('should verify the SIWE message and return a JWT', async () => {
            const verifySiweDto: VerifySiweDto = {
                message: 'mock-message',
                signature: 'mock-signature',
            }

            const result = await controller.verifySiwe(verifySiweDto)
            expect(result).toEqual({ jwt: 'mock-jwt' })
            expect(siweService.verifySiweMessage).toHaveBeenCalledWith(
                'mock-message',
                'mock-signature'
            )
            expect(authService.generateJwt).toHaveBeenCalledWith(
                '0x123',
                AUTH_PROVIDERS.SIWE
            )
        })
    })
})
