import { Test, TestingModule } from '@nestjs/testing'
import { AuthSiweController } from './auth-siwe.controller'
import { SiweService } from './siwe.service'
import { AuthService } from '../auth/auth.service'
import { VerifySiweDto } from './dto/verify-siwe.dto'
import { AUTH_PROVIDERS } from '../auth/constants/provider.constants'
import { parseSiweMessage } from 'viem/siwe'

jest.mock('viem/siwe', () => ({
    parseSiweMessage: jest.fn(),
}))

describe('AuthSiweController', () => {
    let controller: AuthSiweController
    let siweService: SiweService
    let authService: AuthService

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
                    provide: AuthService,
                    useValue: {
                        generateJwt: jest.fn(),
                    },
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
            const nonce = 'nonce'
            jest.spyOn(siweService, 'getNonce').mockReturnValue(nonce)

            expect(controller.getNonce()).toEqual({ nonce })
        })
    })

    describe('verifySiwe', () => {
        it('should verify SIWE message and return a JWT', async () => {
            const verifySiweDto: VerifySiweDto = {
                message: '0xmessage',
                signature: '0xsignature',
                chainId: 1,
            }
            const jwt = 'jwt'
            const address = '0xaddress'

            jest.spyOn(siweService, 'verifySiweMessage').mockResolvedValue(
                undefined
            )
            jest.spyOn(authService, 'generateJwt').mockResolvedValue(jwt)
            ;(parseSiweMessage as jest.Mock).mockReturnValue({ address })

            const result = await controller.verifySiwe(verifySiweDto)

            expect(result).toEqual({ jwt })
            expect(siweService.verifySiweMessage).toHaveBeenCalledWith(
                verifySiweDto.message,
                verifySiweDto.signature,
                verifySiweDto.chainId
            )
            expect(authService.generateJwt).toHaveBeenCalledWith(
                address,
                AUTH_PROVIDERS.SIWE
            )
        })
    })
})
