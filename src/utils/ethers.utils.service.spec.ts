import { Test, TestingModule } from '@nestjs/testing'
import { EthersUtilsService } from './ethers.utils.service'
import { JsonRpcProvider, Wallet } from 'ethers'
import { SUPPORTED_CHAINS } from '../shared/constants/chain.constants'

describe('EthersUtilsService', () => {
    let service: EthersUtilsService

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [EthersUtilsService],
        }).compile()

        service = module.get<EthersUtilsService>(EthersUtilsService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('getProvider', () => {
        it('should return a provider for supported chain IDs', () => {
            for (const chainId of SUPPORTED_CHAINS) {
                const provider = service.getProvider(chainId)
                expect(provider).toBeInstanceOf(JsonRpcProvider)
            }
        })
    })

    describe('getSigner', () => {
        const testPrivateKey =
            '0x0123456789012345678901234567890123456789012345678901234567890123'

        it('should return a signer for supported chain IDs', () => {
            for (const chainId of SUPPORTED_CHAINS) {
                const signer = service.getSigner(chainId, testPrivateKey)
                expect(signer).toBeInstanceOf(Wallet)
                expect(signer.provider).toBeInstanceOf(JsonRpcProvider)
            }
        })
    })
})
