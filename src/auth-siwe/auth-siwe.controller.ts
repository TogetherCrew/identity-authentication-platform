// auth-siwe-controller.service.ts
import {
    Controller,
    Get,
    Post,
    Body,
    HttpStatus,
    HttpCode,
} from '@nestjs/common'
import { SiweService } from './siwe.service'
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiOkResponse,
} from '@nestjs/swagger'
import { AuthService } from '../auth/auth.service'
import { VerifySiweDto } from './dto/verify-siwe.dto'
import { AUTH_PROVIDERS } from '../auth/constants/provider.constants'
import { JwtResponse } from '../auth//dto/jwt-response.dto'

@ApiTags(`${AUTH_PROVIDERS.SIWE} Authentication`)
@Controller(`auth/${AUTH_PROVIDERS.SIWE}`)
export class AuthSiweController {
    constructor(
        private readonly siweService: SiweService,
        private readonly authService: AuthService
    ) {}

    @Get('nonce')
    @ApiOperation({ summary: 'Get SIWE nonce' })
    @ApiResponse({ status: 200, description: 'Nonce generated successfully.' })
    getNonce(): string {
        return this.siweService.createNonce()
    }

    @Post('verify')
    @ApiOperation({ summary: 'Verify SIWE message and get JWT' })
    @ApiOkResponse({
        description: 'JWT generated successfully.',
        type: JwtResponse,
    })
    @HttpCode(HttpStatus.OK)
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
