// src/utils/utils.module.ts
import { Module } from '@nestjs/common';
import { CryptoUtilsService } from './crypto-utils.service';
import { EncodeUtilsService } from './encode-utils.service';

@Module({
  providers: [CryptoUtilsService, EncodeUtilsService],
  exports: [CryptoUtilsService, EncodeUtilsService],
})
export class UtilsModule {}
