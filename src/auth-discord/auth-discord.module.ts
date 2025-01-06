import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { UtilsModule } from '../utils/utils.module';
import { AuthDiscordController } from './auth-discord.controller';

@Module({
    imports: [AuthModule, UtilsModule],
    providers: [],
    controllers: [AuthDiscordController],
})
export class AuthDiscordModule {}
