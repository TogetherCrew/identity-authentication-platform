import { Module } from '@nestjs/common'
import { EasService } from './eas.service'
import { UtilsModule } from 'src/utils/utils.module'
@Module({
    imports: [UtilsModule],
    providers: [EasService],
    exports: [],
})
export class EasModule {}
