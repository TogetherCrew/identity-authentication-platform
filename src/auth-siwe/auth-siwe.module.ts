import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '../jwt/jwt.module';
import { UtilsModule } from '../utils/utils.module';
import { AuthSiweController } from './auth-siwe.controller';
import { SiweService } from './siwe.service';

@Module({
    imports: [AuthModule, UtilsModule, JwtModule],
    controllers: [AuthSiweController],
    providers: [SiweService],
})
export class AuthSiweModule {}
