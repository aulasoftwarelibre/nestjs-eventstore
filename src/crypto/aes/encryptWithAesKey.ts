import * as crypto from 'crypto';

import { AESKey } from './types';

export const encryptWithAesKey = (data: Buffer, aesKey: AESKey): Buffer => {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(aesKey.key, 'hex'),
    Buffer.from(aesKey.iv, 'hex'),
  );

  const bufferEncrypted = cipher.update(Buffer.from(data));
  const bufferFinal = cipher.final();

  const encrypted = Buffer.concat([bufferEncrypted, bufferFinal]);

  return encrypted;
};
