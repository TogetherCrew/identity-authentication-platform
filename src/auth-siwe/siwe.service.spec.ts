import { Test, TestingModule } from '@nestjs/testing'
import { SiweService } from './siwe.service'
// import { SiweMessage } from 'siwe'
// import { HttpException, HttpStatus } from '@nestjs/common'
// import { AUTH_PROVIDERS } from '../auth/constants/provider.constants'

jest.mock('siwe', () => {
    return {
        SiweMessage: jest.fn().mockImplementation((message) => {
            return {
                message,
                verify: jest.fn(),
            }
        }),
        generateNonce: jest.fn(() => 'mock-nonce'),
    }
})

describe('SiweService', () => {
    let service: SiweService

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SiweService],
        }).compile()

        service = module.get<SiweService>(SiweService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('createNonce', () => {
        it('should return a nonce', () => {
            const nonce = service.createNonce()
            expect(nonce).toBe('mock-nonce')
        })
    })

    // describe('verifySiweMessage', () => {
    //     it('should verify the SIWE message and return the message object', async () => {
    //         const mockMessage = 'mock-message'
    //         const mockSignature = 'mock-signature'

    //         const siweMessageInstance = new SiweMessage(mockMessage)
    //         ;(siweMessageInstance.verify as jest.Mock).mockResolvedValue(true)

    //         const result = await service.verifySiweMessage(
    //             mockMessage,
    //             mockSignature
    //         )

    //         expect(result).toBeInstanceOf(SiweMessage)
    //         expect(siweMessageInstance.verify).toHaveBeenCalledWith({
    //             signature: mockSignature,
    //         })
    //     })

    //     it('should throw an HttpException if verification fails', async () => {
    //         const mockMessage = 'mock-message'
    //         const mockSignature = 'mock-signature'

    //         const siweMessageInstance = new SiweMessage(mockMessage)
    //         ;(siweMessageInstance.verify as jest.Mock).mockRejectedValue(
    //             new Error('Verification failed')
    //         )

    //         await expect(
    //             service.verifySiweMessage(mockMessage, mockSignature)
    //         ).rejects.toThrow(
    //             new HttpException(
    //                 `Error ${AUTH_PROVIDERS.SIWE} verification`,
    //                 HttpStatus.BAD_REQUEST
    //             )
    //         )
    //         expect(siweMessageInstance.verify).toHaveBeenCalledWith({
    //             signature: mockSignature,
    //         })
    //     })
    // })
})
