// src/utils/encode-utils.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class EncodeUtilsService {
  base64UrlEncode(buffer: Buffer): string {
    return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
}
