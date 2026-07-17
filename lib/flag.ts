// import crypto from 'crypto';

// export function hashFlag(salt: string, flag: string): string {
//   return crypto.createHash('sha256').update(salt + flag).digest('hex');
// }

// export function verifyFlag(salt: string, submittedFlag: string, expectedHash: string): boolean {
//   const submittedHash = hashFlag(salt, submittedFlag);
//   return submittedHash === expectedHash;
// }

// export function validateFlagFormat(flag: string, pattern: RegExp): boolean {
//   return pattern.test(flag);
// }

// export function clientVerifyFlag(
//   submittedFlag: string,
//   salt: string,
//   expectedHash: string,
//   formatPattern: RegExp
// ): { valid: boolean; error?: string } {
//   if (!validateFlagFormat(submittedFlag, formatPattern)) {
//     return { valid: false, error: 'Invalid flag format' };
//   }

//   return crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + submittedFlag)).then((hashBuffer) => {
//     const hashArray = Array.from(new Uint8Array(hashBuffer));
//     const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

//     if (hashHex === expectedHash) {
//       return { valid: true };
//     } else {
//       return { valid: false, error: 'Incorrect flag' };
//     }
//   });
// }
import crypto from 'crypto';

export interface FlagVariant {
  id: string;
  sha256: string;
}

export interface FlagValidationResult {
  valid: boolean;
  error?: string;
  variantId?: string;
}

/**
 * Hashes a flag using the challenge-specific salt.
 */
export function hashFlag(salt: string, flag: string): string {
  return crypto
    .createHash('sha256')
    .update(salt + flag)
    .digest('hex');
}

/**
 * Produces a stable index from the student ID and challenge ID.
 *
 * This is used for deterministic assignment, not cryptographic security.
 * The same student receives the same variant for the same challenge.
 */
export function getAssignedVariantIndex(
  studentId: string,
  challengeId: string,
  variantCount: number
): number {
  if (variantCount < 1) {
    throw new Error('At least one flag variant is required.');
  }

  const assignmentKey = `${studentId}:${challengeId}`;

  let hash = 2166136261;

  for (let i = 0; i < assignmentKey.length; i += 1) {
    hash ^= assignmentKey.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0) % variantCount;
}

/**
 * Returns the flag variant assigned to a student for a challenge.
 */
export function getAssignedVariant(
  studentId: string,
  challengeId: string,
  variants: FlagVariant[]
): FlagVariant {
  if (variants.length === 0) {
    throw new Error('No flag variants are configured.');
  }

  const index = getAssignedVariantIndex(
    studentId,
    challengeId,
    variants.length
  );

  return variants[index];
}

/**
 * Server-side validation against the student's assigned variant.
 */
export function verifyFlag(
  salt: string,
  submittedFlag: string,
  studentId: string,
  challengeId: string,
  variants: FlagVariant[]
): boolean {
  const assignedVariant = getAssignedVariant(
    studentId,
    challengeId,
    variants
  );

  const submittedHash = hashFlag(salt, submittedFlag);

  return submittedHash === assignedVariant.sha256;
}

export function validateFlagFormat(
  flag: string,
  pattern: RegExp
): boolean {
  return pattern.test(flag);
}

/**
 * Client-side validation against the student's assigned variant.
 */
export async function clientVerifyFlag(
  submittedFlag: string,
  salt: string,
  studentId: string,
  challengeId: string,
  variants: FlagVariant[],
  formatPattern: RegExp
): Promise<FlagValidationResult> {
  if (!validateFlagFormat(submittedFlag, formatPattern)) {
    return {
      valid: false,
      error: 'Invalid flag format',
    };
  }

  if (variants.length === 0) {
    return {
      valid: false,
      error: 'No flag variants are configured',
    };
  }

  const assignedVariant = getAssignedVariant(
    studentId,
    challengeId,
    variants
  );

  const encodedFlag = new TextEncoder().encode(
    salt + submittedFlag
  );

  const hashBuffer = await globalThis.crypto.subtle.digest(
    'SHA-256',
    encodedFlag
  );

  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  if (hashHex === assignedVariant.sha256) {
    return {
      valid: true,
      variantId: assignedVariant.id,
    };
  }

  return {
    valid: false,
    error: 'Incorrect flag',
    variantId: assignedVariant.id,
  };
}
