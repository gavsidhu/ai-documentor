import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'crypto';

const algorithm = 'aes-256-cbc';
const password = createHash('sha256')
  .update(String(process.env.CRYPTO_SECRET_KEY as string))
  .digest('base64')
  .substr(0, 32);
const iv = randomBytes(16);

export function encrypt(text: string): { iv: string; encryptedData: string } {
  const cipher = createCipheriv(algorithm, password, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

export function decrypt(encryptedData: {
  iv: string;
  encryptedData: string;
}): string {
  const ivBuffer = Buffer.from(encryptedData.iv, 'hex');
  const encryptedTextBuffer = Buffer.from(encryptedData.encryptedData, 'hex');
  const decipher = createDecipheriv(algorithm, password, ivBuffer);
  let decrypted = decipher.update(encryptedTextBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
