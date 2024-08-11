import * as crypto from 'node:crypto'

export const generateHash = (
  data: string | Buffer,
  salt: string | Buffer,
  iterations: number,
  keylen: number,
  digest: string,
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      data,
      salt,
      iterations,
      keylen,
      digest,
      (error, derivedKey) => {
        if (error) {
          reject(error)
        } else {
          resolve(derivedKey)
        }
      },
    )
  })
}
