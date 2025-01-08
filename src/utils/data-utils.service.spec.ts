import { Test, TestingModule } from '@nestjs/testing';
import { DataUtilsService } from './data-utils.service';

describe('DataUtilsService', () => {
    let service: DataUtilsService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DataUtilsService],
        }).compile();

        service = module.get<DataUtilsService>(DataUtilsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('convertBigIntsToStrings', () => {
        it('should convert a bigint to a string', () => {
            const input = BigInt(12345678901234567890n);
            const result = service.convertBigIntsToStrings(input);
            expect(result).toBe('12345678901234567890');
        });

        it('should convert bigints in an object to strings', () => {
            const input = {
                a: BigInt(123),
                b: BigInt(456),
                c: 'string value',
                d: 789,
            };
            const expected = {
                a: '123',
                b: '456',
                c: 'string value',
                d: 789,
            };
            const result = service.convertBigIntsToStrings(input);
            expect(result).toEqual(expected);
        });

        it('should convert bigints in an array to strings', () => {
            const input = [BigInt(123), BigInt(456), 'string value', 789];
            const expected = ['123', '456', 'string value', 789];
            const result = service.convertBigIntsToStrings(input);
            expect(result).toEqual(expected);
        });

        it('should handle nested objects and arrays', () => {
            const input = {
                a: [BigInt(123), { b: BigInt(456) }],
                c: { d: [BigInt(789)] },
            };
            const expected = {
                a: ['123', { b: '456' }],
                c: { d: ['789'] },
            };
            const result = service.convertBigIntsToStrings(input);
            expect(result).toEqual(expected);
        });
    });

    describe('convertStringsToBigInts', () => {
        it('should convert a string to a bigint', () => {
            const input = '12345678901234567890';
            const result = service.convertStringsToBigInts(input);
            expect(result).toBe(BigInt(input));
        });

        it('should convert strings in an object to bigints', () => {
            const input = {
                a: '123',
                b: '456',
                c: 'string value',
                d: 789,
            };
            const expected = {
                a: BigInt(123),
                b: BigInt(456),
                c: 'string value',
                d: 789,
            };
            const result = service.convertStringsToBigInts(input);
            expect(result).toEqual(expected);
        });

        it('should convert strings in an array to bigints', () => {
            const input = ['123', '456', 'string value', 789];
            const expected = [BigInt(123), BigInt(456), 'string value', 789];
            const result = service.convertStringsToBigInts(input);
            expect(result).toEqual(expected);
        });

        it('should handle nested objects and arrays', () => {
            const input = {
                a: ['123', { b: '456' }],
                c: { d: ['789'] },
            };
            const expected = {
                a: [BigInt(123), { b: BigInt(456) }],
                c: { d: [BigInt(789)] },
            };
            const result = service.convertStringsToBigInts(input);
            expect(result).toEqual(expected);
        });

        it('should ignore non-numeric strings', () => {
            const input = {
                a: 'not a number',
                b: '1234',
                c: [BigInt(5678), '9000'],
            };
            const expected = {
                a: 'not a number',
                b: BigInt(1234),
                c: [BigInt(5678), BigInt(9000)],
            };
            const result = service.convertStringsToBigInts(input);
            expect(result).toEqual(expected);
        });
    });
});
