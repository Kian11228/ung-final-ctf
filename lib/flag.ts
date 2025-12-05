import crypto from 'crypto';

export function hashFlag(salt: string, flag: string): string {
  return crypto.createHash('sha256').update(salt + flag).digest('hex');
}

export function verifyFlag(salt: string, submittedFlag: string, expectedHash: string): boolean {
  const submittedHash = hashFlag(salt, submittedFlag);
  return submittedHash === expectedHash;
}

export function validateFlagFormat(flag: string, pattern: RegExp): boolean {
  return pattern.test(flag);
}

export function clientVerifyFlag(
  submittedFlag: string,
  salt: string,
  expectedHash: string,
  formatPattern: RegExp
): { valid: boolean; error?: string } {
  if (!validateFlagFormat(submittedFlag, formatPattern)) {
    return { valid: false, error: 'Invalid flag format' };
  }

  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + submittedFlag)).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    if (hashHex === expectedHash) {
      return { valid: true };
    } else {
      return { valid: false, error: 'Incorrect flag' };
    }
  });
}
