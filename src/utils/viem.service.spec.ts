import { Test, TestingModule } from '@nestjs/testing'
import { ViemUtilsService } from './viem.utils.service'
import { SUPPORTED_CHAINS } from '../shared/constants/chain.constants'
import * as chains from 'viem/chains'

describe('ViemService', () => {
    let service: ViemUtilsService

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ViemUtilsService],
        }).compile()

        service = module.get<ViemUtilsService>(ViemUtilsService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('idToChain', () => {
        it('should return the correct chain for supported chain IDs', () => {
            for (const chainId of SUPPORTED_CHAINS) {
                const expectedChain = Object.values(chains).find(
                    (chain) => chain.id === chainId
                )
                const result = service.idToChain(chainId)
                expect(result).toBe(expectedChain)
            }
        })

        it('should return undefined for an unknown chain ID', () => {
            const chain = service.idToChain(9999)
            expect(chain).toBeUndefined()
        })
    })

    describe('getPublicClient', () => {
        it('should return a public client for supported chain IDs', () => {
            for (const chainId of SUPPORTED_CHAINS) {
                const client = service.getPublicClient(chainId)
                expect(client).toBeDefined()
            }
        })

        it('should return undefined for unsupported chain ID', () => {
            const chainId = 9999
            const client = service.getPublicClient(chainId)
            expect(client).toBeUndefined()
        })
    })
})
