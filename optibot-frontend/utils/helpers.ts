import { Price } from 'types';
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes
} from 'crypto';

export const getURL = () => {
  let url =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/'
      : (process?.env?.NEXT_PUBLIC_SITE_URL as string); // Set this to your site URL in production env.

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

export function fixKeyLength(password: string) {
  return createHash('sha256')
    .update(String(password))
    .digest('base64')
    .substr(0, 32);
}

export function encrypt(text: string, password: string) {
  const newPassword = fixKeyLength(password);
  const iv = randomBytes(16);
  let cipher = createCipheriv('aes-256-cbc', Buffer.from(newPassword), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

export function decrypt(
  text: { iv: string; encryptedData: string },
  password: string
) {
  const newPassword = fixKeyLength(password);
  let iv = Buffer.from(text.iv, 'hex');
  let encryptedText = Buffer.from(text.encryptedData, 'hex');
  let decipher = createDecipheriv('aes-256-cbc', Buffer.from(newPassword), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
