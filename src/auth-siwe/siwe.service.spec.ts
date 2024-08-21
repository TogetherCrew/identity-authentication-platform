import { Test, TestingModule } from '@nestjs/testing'
import { SiweService } from './siwe.service'
import { ViemUtilsService } from '../utils/viem.utils.service'
import { PinoLogger, LoggerModule } from 'nestjs-pino'
import { HttpException } from '@nestjs/common'

describe('SiweService', () => {
    let service: SiweService
    let publicClientMock: { verifySiweMessage: jest.Mock }
    let loggerMock: PinoLogger

    beforeAll(async () => {
        publicClientMock = {
            verifySiweMessage: jest.fn(),
        }

        const module: TestingModule = await Test.createTestingModule({
            imports: [LoggerModule.forRoot()],
            providers: [
                SiweService,
                {
                    provide: ViemUtilsService,
                    useValue: {
                        getPublicClient: jest
                            .fn()
                            .mockReturnValue(publicClientMock),
                    },
                },
                {
                    provide: PinoLogger,
                    useValue: loggerMock,
                },
            ],
        }).compile()

        service = module.get<SiweService>(SiweService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('createNonce', () => {
        it('should generate a nonce', () => {
            const nonce = 'nonce'
            jest.spyOn(service, 'getNonce').mockReturnValue(nonce)

            expect(service.getNonce()).toBe(nonce)
        })
    })

    describe('verifySiweMessage', () => {
        it('should verify a valid SIWE message', async () => {
            const message = 'valid message'
            const signature = '0xvalidsignature'
            const chainId = 1

            publicClientMock.verifySiweMessage.mockResolvedValue(true)

            await expect(
                service.verifySiweMessage(message, signature, chainId)
            ).resolves.not.toThrow()
        })

        it('should throw an error for an invalid SIWE message', async () => {
            const message = 'invalid message'
            const signature = '0xinvalidsignature'
            const chainId = 1

            publicClientMock.verifySiweMessage.mockResolvedValue(false)

            await expect(
                service.verifySiweMessage(message, signature, chainId)
            ).rejects.toThrow(HttpException)
        })
    })
})
