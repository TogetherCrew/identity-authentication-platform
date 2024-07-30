import { Test, TestingModule } from '@nestjs/testing'
import { ViemService } from './viem.service'
import { SUPPORTED_CHAIN_IDS } from './constants/viem.constants'
import * as chains from 'viem/chains'

describe('ViemService', () => {
    let service: ViemService

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ViemService],
        }).compile()

        service = module.get<ViemService>(ViemService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('idToChain', () => {
        it('should return the correct chain for supported chain IDs', () => {
            for (const chainId of SUPPORTED_CHAIN_IDS) {
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
            for (const chainId of SUPPORTED_CHAIN_IDS) {
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
