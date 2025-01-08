import { Module } from '@nestjs/common';

import { JwtModule } from '../jwt/jwt.module';
import { LitModule } from '../lit/lit.module';
import { UtilsModule } from '../utils/utils.module';
import { EasController } from './eas.controller';
import { EasService } from './eas.service';

@Module({
    imports: [JwtModule, UtilsModule, LitModule],
    providers: [EasService],
    controllers: [EasController],
    exports: [EasService],
})
export class EasModule {}
