import { Test, TestingModule } from '@nestjs/testing'
import { DataUtilsService } from './data-utils.service'

describe('DataUtilsService', () => {
    let service: DataUtilsService

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DataUtilsService],
        }).compile()

        service = module.get<DataUtilsService>(DataUtilsService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    it('should convert BigInt values to strings or numbers', () => {
        const input = {
            bigIntValue: BigInt(12345678901234567890n),
            safeIntValue: BigInt(123),
            arrayValue: [BigInt(456), 'string'],
            nestedObject: {
                bigIntValue: BigInt(789),
                stringValue: 'test',
            },
        }
        const expectedOutput = {
            bigIntValue: '12345678901234567890',
            safeIntValue: 123,
            arrayValue: [456, 'string'],
            nestedObject: {
                bigIntValue: 789,
                stringValue: 'test',
            },
        }
        expect(service.formatBigIntValues(input)).toEqual(expectedOutput)
    })

    it('should handle null and undefined values', () => {
        expect(service.formatBigIntValues(null)).toBeNull()
        expect(service.formatBigIntValues(undefined)).toBeUndefined()
    })

    it('should handle non-BigInt values unchanged', () => {
        const input = {
            stringValue: 'test',
            numberValue: 123,
            booleanValue: true,
        }
        expect(service.formatBigIntValues(input)).toEqual(input)
    })
})
