import { Module } from '@nestjs/common';
import { AuthDiscordService } from './auth-discord.service';
import { AuthModule } from 'src/auth/auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [AuthModule, HttpModule],
  providers: [AuthDiscordService],
})
export class AuthDiscordModule {}
