// auth-siwe.module.ts
import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { AuthSiweController } from './auth-siwe.controller'
import { SiweService } from './siwe.service'

@Module({
    imports: [AuthModule],
    controllers: [AuthSiweController],
    providers: [SiweService],
})
export class AuthSiweModule {}
