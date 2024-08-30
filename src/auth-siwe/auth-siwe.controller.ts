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
    ApiBadRequestResponse,
    ApiOkResponse,
} from '@nestjs/swagger'
import { AuthService } from '../auth/auth.service'
import { VerifySiweDto } from './dto/verify-siwe.dto'
import { JwtResponse } from '../auth//dto/jwt-response.dto'
import { parseSiweMessage } from 'viem/siwe'
import { NonceResponse } from './dto/nonce.dto'
import { JWT_PROVIDERS } from '../auth/constants/jwt.constants'
import { AUTH_METHODS } from 'src/auth/constants/auth.constants'

@ApiTags(`${JWT_PROVIDERS.SIWE} Authentication`)
@Controller(`auth/${AUTH_METHODS.SIWE}`)
export class AuthSiweController {
    constructor(
        private readonly siweService: SiweService,
        private readonly authService: AuthService
    ) {}

    @Get('nonce')
    @ApiOperation({ summary: 'Get SIWE nonce' })
    @ApiOkResponse({
        description: 'Nonce generated successfully.',
        type: NonceResponse,
    })
    getNonce() {
        return { nonce: this.siweService.getNonce() }
    }

    @Post('verify')
    @ApiOperation({ summary: 'Verify SIWE message and get JWT' })
    @ApiOkResponse({
        description: 'JWT generated successfully.',
        type: JwtResponse,
    })
    @ApiBadRequestResponse({ description: 'SIWE verification failed.' })
    @HttpCode(HttpStatus.OK)
    async verifySiwe(@Body() verifySiweDto: VerifySiweDto) {
        const { message, signature, chainId } = verifySiweDto
        await this.siweService.verifySiweMessage(message, signature, chainId)
        const jwt = this.authService.generateUserJWT(
            parseSiweMessage(message).address,
            AUTH_METHODS.SIWE
        )
        return { jwt }
    }
}
