import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { EasModule } from '../eas/eas.module'
import { LinkingController } from './linking.controller'
import { UtilsModule } from '../utils/utils.module'

@Module({
    imports: [AuthModule, EasModule, UtilsModule],
    providers: [],
    controllers: [LinkingController],
})
export class LinkingModule {}
