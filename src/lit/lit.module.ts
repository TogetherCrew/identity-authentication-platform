import { Module } from '@nestjs/common';
import { LitService } from './lit.service';
import { UtilsModule } from '../utils/utils.module';

@Module({
    imports: [UtilsModule],
    providers: [LitService],
    exports: [LitService],
})
export class LitModule {}
