import { Module } from '@nestjs/common'
import { AuthGoogleController } from './auth-google.controller'
import { AuthModule } from '../auth/auth.module'
import { UtilsModule } from '../utils/utils.module'
import { AuthGoogleService } from './auth-google.service'

@Module({
    imports: [AuthModule, UtilsModule],
    providers: [AuthGoogleService],
    controllers: [AuthGoogleController],
})
export class AuthGoogleModule {}
