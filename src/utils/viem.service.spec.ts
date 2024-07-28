import { Test, TestingModule } from '@nestjs/testing'
import { ViemService } from './viem.service'
import { mainnet, sepolia, Chain } from 'viem/chains'

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

    describe('stringToChain', () => {
        it('should return mainnet chain for "mainnet" string', () => {
            const chain = service.stringToChain('mainnet')
            expect(chain).toBe(mainnet)
        })

        it('should return sepolia chain for "sepolia" string', () => {
            const chain = service.stringToChain('sepolia')
            expect(chain).toBe(sepolia)
        })

        it('should return null for an unknown chain string', () => {
            const chain = service.stringToChain('unknown')
            expect(chain).toBeNull()
        })
    })

    describe('getTransportByChain', () => {
        it('should return Transport for mainnet', () => {
            const transport = service.getTransportByChain(mainnet)
            expect(transport).toBeDefined()
            expect(transport).toBeInstanceOf(Function)
        })

        it('should return Transport for sepolia', () => {
            const transport = service.getTransportByChain(sepolia)
            expect(transport).toBeDefined()
            expect(transport).toBeInstanceOf(Function)
        })

        it('should return null for an unknown chain', () => {
            const unknownChain: Chain = {} as Chain
            const transport = service.getTransportByChain(unknownChain)
            expect(transport).toBeNull()
        })
    })
})
