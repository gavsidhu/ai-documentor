import { Price } from 'types';
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes
} from 'crypto';

const algorithm = 'aes-256-cbc';
const password = createHash('sha256')
  .update(String(process.env.CRYPTO_SECRET_KEY as string))
  .digest('base64')
  .substr(0, 32);
const iv = randomBytes(16);

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/';
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  return url;
};

export const postData = async ({
  url,
  data
}: {
  url: string;
  data?: { price: Price };
}) => {
  console.log('posting,', url, data);

  const res: Response = await fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    console.log('Error in postData', { url, data, res });

    throw Error(res.statusText);
  }

  return res.json();
};

export const toDateTime = (secs: number) => {
  var t = new Date('1970-01-01T00:30:00Z'); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

export function removeCodeBlockWrappers(code: string) {
  if (code.startsWith('```') && code.endsWith('```')) {
    code = code.slice(3, -3).trim();
  }
  return code;
}

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
