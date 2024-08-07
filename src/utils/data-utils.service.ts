import { Injectable } from '@nestjs/common'

@Injectable()
export class DataUtilsService {
    formatBigIntValues(obj: any): any {
        if (obj === null || obj === undefined) {
            return obj
        } else if (typeof obj === 'bigint') {
            const number = Number(obj)
            // Check if the number is within safe integer range
            if (Number.isSafeInteger(number)) {
                return number
            }
            return obj.toString()
        } else if (Array.isArray(obj)) {
            return obj.map((item) => this.formatBigIntValues(item))
        } else if (typeof obj === 'object') {
            return Object.keys(obj).reduce((acc, key) => {
                acc[key] = this.formatBigIntValues(obj[key])
                return acc
            }, {} as any)
        }
        return obj
    }
}
