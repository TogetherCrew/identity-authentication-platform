import { Module } from '@nestjs/common'
import { LitService } from './lit.service'

@Module({
    imports: [],
    providers: [LitService],
})
export class LitModule {}
