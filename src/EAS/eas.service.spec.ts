import { Test, TestingModule } from '@nestjs/testing'
import { EasService } from './eas.service'
import { EAS_SEPOLIA_CONTRACT_ADDRESS } from './constants/sepolia'
import { sepolia } from 'viem/chains'

describe('EasService', () => {
    let service: EasService

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [EasService],
        }).compile()

        service = module.get<EasService>(EasService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    it('should have a eas contract', () => {
        expect(service.eas).toBeDefined()
    })

    it('should have the correct address', async () => {
        expect(service.eas.address).toEqual(EAS_SEPOLIA_CONTRACT_ADDRESS)
    })

    it('should get domain', async () => {
        const expected = {
            name: 'EAS',
            version: '0.26',
            chainId: sepolia.id,
            verifyingContract: service.eas.address,
        }

        expect(await service.getDomain()).toEqual(expected)
    })
})
