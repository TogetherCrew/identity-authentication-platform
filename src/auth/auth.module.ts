import { UtilsModule } from 'src/utils/utils.module';

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { JwtModule as customJwtModule } from '../jwt/jwt.module';
import { OAuthService } from './oAuth.service';

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
        customJwtModule,
    ],
    providers: [OAuthService],
    exports: [OAuthService],
})
export class AuthModule {}
