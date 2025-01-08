import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { JwtModule } from '../jwt/jwt.module';
import { UtilsModule } from '../utils/utils.module';
import { DiscourseVerificationController } from './discourse-verification.controller';
import { DiscourseVerificationService } from './discourse-verification.service';

@Module({
    imports: [JwtModule, UtilsModule, HttpModule],
    controllers: [DiscourseVerificationController],
    providers: [DiscourseVerificationService],
})
export class DiscourseVerificationModule {}
