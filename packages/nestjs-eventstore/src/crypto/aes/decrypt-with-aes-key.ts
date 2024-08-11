import * as crypto from 'node:crypto'

import { AESKey } from './types'

export const decryptWithAesKey = (data: Buffer, aesKey: AESKey): Buffer => {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(aesKey.key, 'hex'),
    Buffer.from(aesKey.iv, 'hex'),
  )

  const bufferDecrypted = decipher.update(Buffer.from(data))
  const bufferFinal = decipher.final()

  const decrypted = Buffer.concat([bufferDecrypted, bufferFinal])

  return decrypted
}
