import { Module } from '@nestjs/common'
import { EasService } from './eas.service'
import { UtilsModule } from '../utils/utils.module'
@Module({
    imports: [UtilsModule],
    providers: [EasService],
    exports: [EasService],
})
export class EasModule {}
