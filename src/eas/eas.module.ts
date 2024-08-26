import { Module } from '@nestjs/common'
import { EasService } from './eas.service'
import { UtilsModule } from '../utils/utils.module'
import { EasController } from './eas.controller'
import { AuthModule } from '../auth/auth.module'
import { LitModule } from '../lit/lit.module'
@Module({
    imports: [AuthModule, UtilsModule, LitModule],
    providers: [EasService],
    controllers: [EasController],
    exports: [EasService],
})
export class EasModule {}
