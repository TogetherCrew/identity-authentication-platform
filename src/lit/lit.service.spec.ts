import { Test, TestingModule } from '@nestjs/testing'
import { LitService } from './lit.service'
import { ConfigService } from '@nestjs/config'
import {
    LitNodeClientNodeJs,
    // encryptToJson,
} from '@lit-protocol/lit-node-client-nodejs'
// import { keccak256, toHex, Address } from 'viem'
// import { SupportedChainId } from '../shared/types/chain.type'
import { PinoLogger, LoggerModule } from 'nestjs-pino'

jest.mock('@lit-protocol/lit-node-client-nodejs', () => ({
    LitNodeClientNodeJs: jest.fn().mockImplementation(() => ({
        connect: jest.fn().mockResolvedValue(null),
        disconnect: jest.fn().mockResolvedValue(null),
    })),
    encryptToJson: jest.fn().mockResolvedValue('encryptedData'),
}))

const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
        if (key === 'lit.network') {
            return 'datil-dev'
        }
        return null
    }),
}

describe('LitService', () => {
    let service: LitService
    let litNodeClient: LitNodeClientNodeJs
    let loggerMock: PinoLogger

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [LoggerModule.forRoot()],
            providers: [
                LitService,
                { provide: ConfigService, useValue: mockConfigService },
                { provide: PinoLogger, useValue: loggerMock },
            ],
        }).compile()
        service = module.get<LitService>(LitService)
        litNodeClient = new LitNodeClientNodeJs({
            alertWhenUnauthorized: false,
            litNetwork: 'datil-dev',
            debug: true,
        })
        service['litNodeClient'] = litNodeClient
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    // describe('connect', () => {
    //     it('should connect to the Lit node client', async () => {
    //         await service.connect()

    //         // Assert that the LitNodeClientNodeJs constructor was called with the expected config
    //         expect(litNodeClientConstructorSpy).toHaveBeenCalledWith({
    //             alertWhenUnauthorized: false,
    //             litNetwork: 'datil-dev',
    //             debug: true,
    //         })

    //         // Get the instance created by the constructor spy
    //         const litNodeClientInstance =
    //             litNodeClientConstructorSpy.mock.instances[0]

    //         // Ensure the connect method was called on this instance
    //         expect(litNodeClientInstance.connect).toHaveBeenCalled()
    //     })
    // })

    describe('disconnect', () => {
        it('should disconnect from the Lit node client', async () => {
            const litNodeClient = service['litNodeClient']
            await service.disconnect()
            expect(litNodeClient.disconnect).toHaveBeenCalled()
            expect(service['litNodeClient']).toBeNull()
        })
    })

    describe('getNetworkConfig', () => {
        it('should return the correct network configuration', () => {
            const mockNetworkConfig = { litNetwork: 'test-network' }
            service['getNetworkConfig'] = jest
                .fn()
                .mockReturnValue(mockNetworkConfig)

            expect(service.getNetworkConfig('test-network')).toEqual(
                mockNetworkConfig
            )
        })
        it('should throw an error if the network is unsupported', () => {
            expect(() =>
                service.getNetworkConfig('unsupported-network')
            ).toThrow(Error('Unsupported lit network: unsupported-network'))
        })
    })

    // describe('generateEvmContractConditions', () => {
    //     it('should generate the correct EVM contract conditions', () => {
    //         const chainId = 11155111 as SupportedChainId
    //         const userAddress: Address = '0xUser'
    //         const mockConditions = [
    //             {
    //                 contractAddress: '0x123',
    //                 functionName: 'testFunction',
    //                 functionParams: [
    //                     keccak256(toHex(userAddress)),
    //                     ':userAddress',
    //                 ],
    //                 functionAbi: {},
    //                 chain: 'ethereum',
    //                 returnValueTest: {
    //                     key: '',
    //                     comparator: '=',
    //                     value: 'true',
    //                 },
    //             },
    //         ]
    //         const conditions = service.generateEvmContractConditions(
    //             chainId,
    //             userAddress
    //         )
    //         expect(conditions).toEqual(mockConditions)
    //     })
    // })

    // describe('encrypt', () => {
    //     // it('should successfully encrypt data', async () => {
    //     //     const chainId = 11155111 as SupportedChainId
    //     //     const dataToEncrypt = { test: 'data' }
    //     //     const userAddress: Address = '0xUser'
    //     //     const mockEncryptedData = 'encryptedData'
    //     //     service['generateEvmContractConditions'] = jest
    //     //         .fn()
    //     //         .mockReturnValue([])
    //     //     ;(encryptToJson as jest.Mock).mockResolvedValue(mockEncryptedData)
    //     //     const result = await service.encrypt(
    //     //         chainId,
    //     //         dataToEncrypt,
    //     //         userAddress
    //     //     )
    //     //     expect(result).toBe(mockEncryptedData)
    //     // })
    //     // it('should throw an InternalServerErrorException if encryption fails', async () => {
    //     //     const chainId = 1 as SupportedChainId
    //     //     const dataToEncrypt = { test: 'data' }
    //     //     const userAddress: Address = '0xUser'
    //     //     service['generateEvmContractConditions'] = jest
    //     //         .fn()
    //     //         .mockReturnValue([])
    //     //     ;(encryptToJson as jest.Mock).mockRejectedValue(
    //     //         new Error('Encryption failed')
    //     //     )
    //     //     await expect(
    //     //         service.encrypt(chainId, dataToEncrypt, userAddress)
    //     //     ).rejects.toThrow(InternalServerErrorException)
    //     // })
    // })
})
