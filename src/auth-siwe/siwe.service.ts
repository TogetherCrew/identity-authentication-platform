import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { AUTH_PROVIDERS } from '../auth/constants/provider.constants'
import { generateSiweNonce } from 'viem/siwe'
import { ViemUtilsService } from '../utils/viem.utils.service'
import { Hex } from 'viem'

@Injectable()
export class SiweService {
    private readonly logger = new Logger(SiweService.name)

    constructor(private readonly viemUtilsService: ViemUtilsService) {}

    getNonce(): string {
        return generateSiweNonce()
    }

    async verifySiweMessage(message: string, signature: Hex, chainId: number) {
        const publicClient = this.viemUtilsService.getPublicClient(chainId)
        const isValid = await publicClient.verifySiweMessage({
            message,
            signature,
        })
        if (!isValid) {
            throw new HttpException(
                `${AUTH_PROVIDERS.SIWE} verification Failed`,
                HttpStatus.BAD_REQUEST
            )
        }
    }
}
