import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'
import { AuthModule } from './auth/auth.module'
import { AuthDiscordModule } from './auth-discord/auth-discord.module'
import { AuthGoogleModule } from './auth-google/auth-google.module'
import { AuthSiweModule } from './auth-siwe/auth-siwe.module'
import { configModules, configValidationSchema } from './config'
import { pinoConfig } from './config/pino.config'
import { LitModule } from './lit/lit.module'
import { EasModule } from './eas/eas.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            load: configModules,
            validationSchema: configValidationSchema,
            isGlobal: true,
        }),
        LoggerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: pinoConfig,
        }),
        AuthModule,
        AuthDiscordModule,
        AuthGoogleModule,
        AuthSiweModule,
        LitModule,
        EasModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
