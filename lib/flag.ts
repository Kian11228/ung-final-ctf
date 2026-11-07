/**
 * Multi-variant flag validation.
 *
 * Each challenge defines a pool of flag variants. Every student is
 * deterministically assigned one variant per challenge, and a submission is
 * accepted only if it matches the student's assigned variant. Only salted
 * SHA-256 hashes of the variants are published; the plaintext flags live in
 * the instructor's local answer key (flags.local.json, git-ignored).
 *
 * This module has no Node-only imports so it runs in the browser, in Node
 * 18+, and in tests. It uses the Web Crypto API (globalThis.crypto.subtle).
 */

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
 * Hashes a flag using the challenge-specific salt: SHA-256(salt + flag), hex.
 */
export async function hashFlag(salt: string, flag: string): Promise<string> {
  const encoded = new TextEncoder().encode(salt + flag);
  const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', encoded);

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Produces a stable index from the student ID and challenge ID (FNV-1a).
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

  const index = getAssignedVariantIndex(studentId, challengeId, variants.length);

  return variants[index];
}

/**
 * Builds the regular expression for a challenge's flag format string
 * (for example "ung{.*}"), anchored to the whole submission.
 */
export function flagFormatToRegExp(format: string): RegExp {
  return new RegExp(`^(?:${format})$`);
}

export function validateFlagFormat(flag: string, pattern: RegExp): boolean {
  return pattern.test(flag);
}

/**
 * Validates a submission against the student's assigned variant.
 */
export async function verifyFlag(
  salt: string,
  submittedFlag: string,
  studentId: string,
  challengeId: string,
  variants: FlagVariant[]
): Promise<boolean> {
  const assignedVariant = getAssignedVariant(studentId, challengeId, variants);
  const submittedHash = await hashFlag(salt, submittedFlag);

  return submittedHash === assignedVariant.sha256;
}

/**
 * Client-side validation with user-facing error messages.
 */
export async function clientVerifyFlag(
  submittedFlag: string,
  salt: string,
  studentId: string,
  challengeId: string,
  variants: FlagVariant[],
  formatPattern: RegExp
): Promise<FlagValidationResult> {
  // Surrounding whitespace from copy-paste is ignored; the flag itself is not altered.
  const flag = submittedFlag.trim();

  if (!studentId) {
    return { valid: false, error: 'Enter your student ID before submitting' };
  }

  if (!validateFlagFormat(flag, formatPattern)) {
    return { valid: false, error: 'Invalid flag format' };
  }

  if (variants.length === 0) {
    return { valid: false, error: 'No flag variants are configured' };
  }

  const assignedVariant = getAssignedVariant(studentId, challengeId, variants);
  const hashHex = await hashFlag(salt, flag);

  if (hashHex === assignedVariant.sha256) {
    return { valid: true, variantId: assignedVariant.id };
  }

  return {
    valid: false,
    error: 'Incorrect flag',
    variantId: assignedVariant.id,
  };
}
