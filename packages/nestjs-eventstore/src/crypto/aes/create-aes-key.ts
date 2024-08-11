import { generateHash } from '../hash'
import { AESKey } from './types'

export const createAesKey = async (
  password: string | Buffer,
  salt: string | Buffer,
): Promise<AESKey> => {
  const derivedKey = await generateHash(password, salt, 4096, 48, 'sha256')
  const keyBuffer = Buffer.from(derivedKey)
  const key = keyBuffer.subarray(0, 32).toString('hex')
  const iv = derivedKey.subarray(32).toString('hex')

  return { iv, key }
}
