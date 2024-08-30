import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino'
import { AUTH_METHODS } from '../auth/constants/auth.constants'
import { generateSiweNonce } from 'viem/siwe'
import { ViemUtilsService } from '../utils/viem.utils.service'
import { Hex } from 'viem'

@Injectable()
export class SiweService {
    constructor(
        private readonly viemUtilsService: ViemUtilsService,
        @InjectPinoLogger(SiweService.name)
        private readonly logger: PinoLogger
    ) {}

    getNonce(): string {
        return generateSiweNonce()
    }

    async verifySiweMessage(message: string, signature: Hex, chainId: number) {
        try {
            const publicClient = this.viemUtilsService.getPublicClient(chainId)
            const isValid = await publicClient.verifySiweMessage({
                message,
                signature,
            })
            if (!isValid) {
                throw new Error()
            }
        } catch (error) {
            this.logger.error(error, `Siwe Verification Failed`)
            throw new HttpException(
                `${AUTH_METHODS.SIWE} verification Failed`,
                HttpStatus.BAD_REQUEST
            )
        }
    }
}
