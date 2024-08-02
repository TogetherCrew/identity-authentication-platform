import { Test, TestingModule } from '@nestjs/testing'
import { EasService } from './eas.service'
import { ViemUtilsService } from '../utils/viem.utils.service'
import { ConfigService } from '@nestjs/config'
import { generatePrivateKey } from 'viem/accounts'
// import { EAS_SEPOLIA_CONTRACT_ADDRESS } from './constants/sepolia'
// import { sepolia } from 'viem/chains'

describe('EasService', () => {
    let service: EasService
    const mockPrivateKey = generatePrivateKey()
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EasService,
                ViemUtilsService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => {
                            if (key === 'wallet.privateKey')
                                return mockPrivateKey
                        }),
                    },
                },
            ],
        }).compile()

        service = module.get<EasService>(EasService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    // it('should have a eas contract', () => {
    //     expect(service.eas).toBeDefined()
    // })

    // it('should have the correct address', async () => {
    //     expect(service.eas.address).toEqual(EAS_SEPOLIA_CONTRACT_ADDRESS)
    // })

    // it('should get domain', async () => {
    //     const expected = {
    //         name: 'EAS',
    //         version: '0.26',
    //         chainId: sepolia.id,
    //         verifyingContract: service.eas.address,
    //     }

    //     expect(await service.getDomain()).toEqual(expected)
    // })
})
