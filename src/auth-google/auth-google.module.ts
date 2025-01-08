import { Module } from '@nestjs/common';
import { AuthGoogleController } from './auth-google.controller';
import { AuthModule } from '../auth/auth.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
    imports: [AuthModule, UtilsModule],
    providers: [],
    controllers: [AuthGoogleController],
})
export class AuthGoogleModule {}
