// auth-siwe.service.ts
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { generateNonce, SiweMessage } from 'siwe'
import { AUTH_PROVIDERS } from '../auth/constants/provider.constants'

@Injectable()
export class SiweService {
    private readonly logger = new Logger(SiweService.name)
    createNonce(): string {
        return generateNonce()
    }

    async verifySiweMessage(
        message: string,
        signature: string
    ): Promise<SiweMessage> {
        try {
            const SIWEObject = new SiweMessage(message)
            await SIWEObject.verify({ signature })
            return new SiweMessage(message)
        } catch (error) {
            this.logger.error(
                `Error ${AUTH_PROVIDERS.SIWE} verification`,
                error
            )
            throw new HttpException(
                `Error ${AUTH_PROVIDERS.SIWE} verification`,
                HttpStatus.BAD_REQUEST
            )
        }
    }
}
