import { Module } from '@nestjs/common'
import { AuthDiscordController } from './auth-discord.controller'
import { AuthModule } from 'src/auth/auth.module'
import { UtilsModule } from '../utils/utils.module'
import { AuthDiscordService } from './auth-discord.service'

@Module({
    imports: [AuthModule, UtilsModule],
    providers: [AuthDiscordService],
    controllers: [AuthDiscordController],
})
export class AuthDiscordModule {}
