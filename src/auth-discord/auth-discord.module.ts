import { Module } from '@nestjs/common'
import { AuthDiscordController } from './auth-discord.controller'
import { AuthModule } from 'src/auth/auth.module'
import { UtilsModule } from '../utils/utils.module'

@Module({
    imports: [AuthModule, UtilsModule],
    providers: [],
    controllers: [AuthDiscordController],
})
export class AuthDiscordModule {}
