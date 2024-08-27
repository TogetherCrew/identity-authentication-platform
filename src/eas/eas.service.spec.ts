import { Test, TestingModule } from '@nestjs/testing'
import { EasService } from './eas.service'
import { ConfigService } from '@nestjs/config'
import { generatePrivateKey } from 'viem/accounts'
// import { EAS_SEPOLIA_CONTRACT_ADDRESS } from './constants/sepolia'
// import { sepolia } from 'viem/chains'
import { PinoLogger, LoggerModule } from 'nestjs-pino'
import { EthersUtilsService } from '../utils/ethers.utils.service'
import { AuthService } from '../auth/auth.service'
import { LitService } from '../lit/lit.service'
const mockPrivateKey = generatePrivateKey()

const mockConfigService = {
    get: jest.fn((key: string) => {
        if (key === 'wallet.privateKey') return mockPrivateKey
    }),
}

describe('EasService', () => {
    let service: EasService
    let loggerMock: PinoLogger

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [LoggerModule.forRoot()],
            providers: [
                EasService,
                EthersUtilsService,
                AuthService,
                LitService,
                { provide: ConfigService, useValue: mockConfigService },
                { provide: PinoLogger, useValue: loggerMock },
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
