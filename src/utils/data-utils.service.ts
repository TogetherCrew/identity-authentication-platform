import { Injectable } from '@nestjs/common'

@Injectable()
export class DataUtilsService {
    convertBigIntsToStrings = (obj: any): any => {
        if (typeof obj === 'bigint') {
            return obj.toString()
        }
        if (Array.isArray(obj)) {
            return obj.map(this.convertBigIntsToStrings)
        }
        if (typeof obj === 'object' && obj !== null) {
            return Object.fromEntries(
                Object.entries(obj).map(([k, v]) => [
                    k,
                    this.convertBigIntsToStrings(v),
                ])
            )
        }
        return obj
    }

    convertStringsToBigInts = (obj: any): any => {
        if (typeof obj === 'string' && /^[0-9]+$/.test(obj)) {
            return BigInt(obj)
        }
        if (Array.isArray(obj)) {
            return obj.map(this.convertStringsToBigInts)
        }
        if (typeof obj === 'object' && obj !== null) {
            return Object.fromEntries(
                Object.entries(obj).map(([k, v]) => [
                    k,
                    this.convertStringsToBigInts(v),
                ])
            )
        }
        return obj
    }
}
