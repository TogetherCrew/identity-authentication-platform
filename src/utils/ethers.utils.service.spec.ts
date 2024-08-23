import { Test, TestingModule } from '@nestjs/testing'
import { EthersUtilsService } from './ethers.utils.service'
import { JsonRpcProvider, Wallet } from 'ethers'

const mockPrivateKey =
    '0x0123456789012345678901234567890123456789012345678901234567890123'
const mockRPCURL = 'https://ethereum-sepolia-rpc.publicnode.com'
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
        it('should return a provider for given rpcURL and privateKey', () => {
            const provider = service.getProvider(mockRPCURL)
            expect(provider).toBeInstanceOf(JsonRpcProvider)
        })
    })

    describe('getSigner', () => {
        it('should return a signer for given rpcURL and privateKey', () => {
            const signer = service.getSigner(mockRPCURL, mockPrivateKey)
            expect(signer).toBeInstanceOf(Wallet)
            expect(signer.provider).toBeInstanceOf(JsonRpcProvider)
        })
    })
})
