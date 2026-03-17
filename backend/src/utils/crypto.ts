const ITERATIONS = 100_000;
const HASH_LENGTH = 32;
const ALGORITHM = 'SHA-256';

const bufferToHex = (buffer: ArrayBuffer): string =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

const hexToBuffer = (hex: string): Uint8Array => {
  if (hex.length % 2 !== 0) throw new Error('Invalid hex string length');
  const matches = hex.match(/.{1,2}/g);
  if (!matches) throw new Error('Invalid hex string');
  return new Uint8Array(matches.map((byte) => parseInt(byte, 16)));
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltBuffer = salt.buffer.slice(salt.byteOffset, salt.byteOffset + salt.byteLength) as ArrayBuffer;
  const saltHex = bufferToHex(saltBuffer);

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: ITERATIONS,
      hash: ALGORITHM,
    },
    keyMaterial,
    HASH_LENGTH * 8
  );

  const hashHex = bufferToHex(hashBuffer);
  return `${ITERATIONS}:${saltHex}:${hashHex}`;
};

export const comparePassword = async (
  password: string,
  storedHash: string
): Promise<boolean> => {
  const parts = storedHash.split(':');
  if (parts.length !== 3) return false;

  const [iterStr, saltHex, hashHex] = parts;
  const iterations = parseInt(iterStr, 10);
  const salt = hexToBuffer(saltHex);
  const saltBuffer = salt.buffer.slice(salt.byteOffset, salt.byteOffset + salt.byteLength) as ArrayBuffer;

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations,
      hash: ALGORITHM,
    },
    keyMaterial,
    HASH_LENGTH * 8
  );

  const computedHex = bufferToHex(hashBuffer);
  return computedHex === hashHex;
};
