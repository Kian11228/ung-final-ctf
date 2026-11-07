import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  clientVerifyFlag,
  flagFormatToRegExp,
  getAssignedVariant,
  getAssignedVariantIndex,
  hashFlag,
  verifyFlag,
} from './flag';

const salt = 'ung_salt_test-challenge_2025';
const plaintext = ['a', 'b', 'c', 'd'].map((x) => `ung{test_flag_variant_${x}}`);
const variants = plaintext.map((flag, i) => ({
  id: `variant-${'abcd'[i]}`,
  sha256: createHash('sha256').update(salt + flag).digest('hex'),
}));
const format = flagFormatToRegExp('ung{.*}');

describe('hashFlag', () => {
  it('matches Node SHA-256 of salt + flag', async () => {
    expect(await hashFlag(salt, plaintext[0])).toBe(variants[0].sha256);
  });
});

describe('variant assignment', () => {
  it('is deterministic for the same student and challenge', () => {
    const first = getAssignedVariantIndex('900123456', 'web-sqli', 4);
    for (let i = 0; i < 10; i += 1) {
      expect(getAssignedVariantIndex('900123456', 'web-sqli', 4)).toBe(first);
    }
  });

  it('spreads students across every variant', () => {
    const counts = [0, 0, 0, 0];
    for (let id = 900000000; id < 900001000; id += 1) {
      counts[getAssignedVariantIndex(String(id), 'web-sqli', 4)] += 1;
    }
    for (const count of counts) expect(count).toBeGreaterThan(150);
  });

  it('rejects an empty variant pool', () => {
    expect(() => getAssignedVariantIndex('1', 'x', 0)).toThrow();
  });
});

describe('verification', () => {
  const studentId = '900123456';
  const assigned = getAssignedVariant(studentId, 'test-challenge', variants);
  const assignedFlag = plaintext[variants.indexOf(assigned)];
  const otherFlags = plaintext.filter((f) => f !== assignedFlag);

  it('accepts the flag of the assigned variant', async () => {
    expect(await verifyFlag(salt, assignedFlag, studentId, 'test-challenge', variants)).toBe(true);
    const result = await clientVerifyFlag(assignedFlag, salt, studentId, 'test-challenge', variants, format);
    expect(result).toEqual({ valid: true, variantId: assigned.id });
  });

  it('ignores whitespace around a pasted flag', async () => {
    const result = await clientVerifyFlag(`  ${assignedFlag}\n`, salt, studentId, 'test-challenge', variants, format);
    expect(result.valid).toBe(true);
  });

  it("rejects another variant's valid flag (a shared flag)", async () => {
    for (const flag of otherFlags) {
      const result = await clientVerifyFlag(flag, salt, studentId, 'test-challenge', variants, format);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Incorrect flag');
    }
  });

  it('rejects a badly formatted flag', async () => {
    const result = await clientVerifyFlag('flag{nope}', salt, studentId, 'test-challenge', variants, format);
    expect(result).toEqual({ valid: false, error: 'Invalid flag format' });
  });

  it('requires a student ID', async () => {
    const result = await clientVerifyFlag(assignedFlag, salt, '', 'test-challenge', variants, format);
    expect(result.valid).toBe(false);
  });
});
