import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { OAuthService } from './oAuth.service'
import { HttpModule } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { UtilsModule } from 'src/utils/utils.module'

@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('jwt.secret'),
            }),
            inject: [ConfigService],
        }),
        HttpModule,
        UtilsModule,
    ],
    providers: [AuthService, OAuthService],
    exports: [AuthService, OAuthService],
})
export class AuthModule {}
