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

export function encrypt(text: any) {
  let cipher = createCipheriv('aes-256-cbc', Buffer.from(password), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}


export function decrypt(text: any) {
  let iv = Buffer.from(text.iv, 'hex');
  let encryptedText = Buffer.from(text.encryptedData, 'hex');
  let decipher = createDecipheriv('aes-256-cbc', Buffer.from(password), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}