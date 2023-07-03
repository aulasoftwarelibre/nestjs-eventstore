import * as crypto from 'crypto';

export const generateHash = (
  data: string | Buffer,
  salt: string | Buffer,
  iterations: number,
  keylen: number,
  digest: string,
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(data, salt, iterations, keylen, digest, (err, derivedKey) => {
      if (err) {
        reject(err);
      } else {
        resolve(derivedKey);
      }
    });
  });
};
