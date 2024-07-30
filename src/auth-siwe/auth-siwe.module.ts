import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { AuthSiweController } from './auth-siwe.controller'
import { SiweService } from './siwe.service'
import { UtilsModule } from '../utils/utils.module'

@Module({
    imports: [AuthModule, UtilsModule],
    controllers: [AuthSiweController],
    providers: [SiweService],
})
export class AuthSiweModule {}
