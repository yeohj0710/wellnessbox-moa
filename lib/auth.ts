import { randomBytes, pbkdf2Sync, timingSafeEqual } from 'crypto';

const SALT_BYTES = 16;
const HASH_BYTES = 32;
const ITERATIONS = 100000;

export function hashPassword(password: string) {
  const salt = randomBytes(SALT_BYTES);
  const hash = pbkdf2Sync(password, salt, ITERATIONS, HASH_BYTES, 'sha256');
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

export function verifyPassword(password: string, stored: string) {
  const [saltHex, hashHex] = stored.split(':');
  const salt = Buffer.from(saltHex, 'hex');
  const hash = Buffer.from(hashHex, 'hex');
  const test = pbkdf2Sync(password, salt, ITERATIONS, HASH_BYTES, 'sha256');
  return timingSafeEqual(hash, test);
}

export function createSessionToken() {
  return randomBytes(32).toString('hex');
}
