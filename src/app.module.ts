import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { configModules, configValidationSchema } from './config';
import { pinoConfig } from './config/pino.config';
import { AuthModule } from './auth/auth.module';
import { AuthDiscordModule } from './auth-discord/auth-discord.module';
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
