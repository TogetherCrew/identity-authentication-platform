// auth-siwe-controller.service.ts
import { Controller, Get, Post, Body } from '@nestjs/common'
import { SiweService } from './siwe.service'
import { AuthService } from '../auth/auth.service'
import { VerifySiweDto } from './dto/verify-siwe.dto'
import { AUTH_PROVIDERS } from '../auth/constants/provider.constants'

@Controller(AUTH_PROVIDERS.SIWE)
export class AuthSiweController {
    constructor(
        private readonly siweService: SiweService,
        private readonly authService: AuthService
    ) {}

    @Get('nonce')
    getNonce(): string {
        return this.siweService.createNonce()
    }

    @Post('verify')
    async verifySiwe(@Body() verifySiweDto: VerifySiweDto) {
        const { message, signature } = verifySiweDto
        const siweMessage = await this.siweService.verifySiweMessage(
            message,
            signature
        )
        const jwt = await this.authService.generateJwt(
            siweMessage.address,
            AUTH_PROVIDERS.SIWE
        )
        return { jwt }
    }
}
