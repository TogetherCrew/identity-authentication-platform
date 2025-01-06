import { parseSiweMessage } from 'viem/siwe';

import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import { AUTH_PROVIDERS } from '../auth/constants/provider.constants';
import { JwtResponse } from '../auth/dto/jwt-response.dto';
import { JwtService } from '../jwt/jwt.service';
import { NonceResponse } from './dto/nonce.dto';
import { VerifySiweDto } from './dto/verify-siwe.dto';
import { SiweService } from './siwe.service';

@ApiTags('Siwe Authentication')
@Controller(`auth/siwe`)
export class AuthSiweController {
    constructor(
        private readonly siweService: SiweService,
        private readonly jwtService: JwtService
    ) {}

    @Get('nonce')
    @ApiOperation({ summary: 'Get SIWE nonce' })
    @ApiOkResponse({
        description: 'Nonce generated successfully.',
        type: NonceResponse,
    })
    getNonce() {
        return { nonce: this.siweService.getNonce() };
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
        const { message, signature, chainId } = verifySiweDto;
        await this.siweService.verifySiweMessage(message, signature, chainId);
        const jwt = await this.jwtService.generateAuthJwt(
            parseSiweMessage(message).address,
            AUTH_PROVIDERS.SIWE
        );
        return { jwt };
    }
}
