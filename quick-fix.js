#!/usr/bin/env node
/**
 * QUICK FIX - Add missing files
 */

const fs = require('fs');

console.log('🔧 Fixing missing files...\n');

// lib/schema.ts
fs.writeFileSync('lib/schema.ts', `import { z } from 'zod';

export const attachmentSchema = z.object({
  file: z.string(),
  sha256: z.string(),
});

export const dockerSchema = z.object({
  label: z.string(),
  url: z.string().url(),
});

export const flagSchema = z.object({
  format: z.string(),
  salt: z.string(),
  sha256: z.string(),
});

export const hintSchema = z.string();

export const challengeFrontmatterSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.enum(['hardware', 'forensics', 'reversing', 'web', 'crypto', 'misc']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  points: z.number().int().positive(),
  tags: z.array(z.string()),
  author: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  attachments: z.array(attachmentSchema).optional(),
  docker: dockerSchema.optional(),
  flag: flagSchema,
  hints: z.array(hintSchema).optional(),
  writeupVisibility: z.enum(['always', 'after-solve', 'hidden']).default('after-solve'),
});

export type ChallengeFrontmatter = z.infer<typeof challengeFrontmatterSchema>;
export type Attachment = z.infer<typeof attachmentSchema>;
export type Docker = z.infer<typeof dockerSchema>;
`);

// lib/filters.ts
fs.writeFileSync('lib/filters.ts', `import type { Challenge } from './content';

export interface FilterOptions {
  categories?: string[];
  difficulties?: string[];
  tags?: string[];
  minPoints?: number;
  maxPoints?: number;
  search?: string;
}

export interface SortOptions {
  field: 'date' | 'points' | 'difficulty' | 'title';
  direction: 'asc' | 'desc';
}

export function filterChallenges(challenges: Challenge[], filters: FilterOptions): Challenge[] {
  let filtered = [...challenges];

  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter((c) => filters.categories!.includes(c.frontmatter.category));
  }

  if (filters.difficulties && filters.difficulties.length > 0) {
    filtered = filtered.filter((c) => filters.difficulties!.includes(c.frontmatter.difficulty));
  }

  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((c) =>
      filters.tags!.some((tag) => c.frontmatter.tags.includes(tag))
    );
  }

  if (filters.minPoints !== undefined) {
    filtered = filtered.filter((c) => c.frontmatter.points >= filters.minPoints!);
  }

  if (filters.maxPoints !== undefined) {
    filtered = filtered.filter((c) => c.frontmatter.points <= filters.maxPoints!);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.frontmatter.title.toLowerCase().includes(searchLower) ||
        c.frontmatter.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
        c.content.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
}

export function sortChallenges(challenges: Challenge[], sort: SortOptions): Challenge[] {
  const sorted = [...challenges];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sort.field) {
      case 'date':
        comparison =
          new Date(a.frontmatter.createdAt).getTime() -
          new Date(b.frontmatter.createdAt).getTime();
        break;
      case 'points':
        comparison = a.frontmatter.points - b.frontmatter.points;
        break;
      case 'difficulty':
        const difficultyOrder = { easy: 0, medium: 1, hard: 2 };
        comparison =
          difficultyOrder[a.frontmatter.difficulty] -
          difficultyOrder[b.frontmatter.difficulty];
        break;
      case 'title':
        comparison = a.frontmatter.title.localeCompare(b.frontmatter.title);
        break;
    }

    return sort.direction === 'asc' ? comparison : -comparison;
  });

  return sorted;
}
`);

// lib/flag.ts
fs.writeFileSync('lib/flag.ts', `import crypto from 'crypto';

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
`);

console.log('✅ lib/schema.ts created');
console.log('✅ lib/filters.ts created');
console.log('✅ lib/flag.ts created');

console.log('\n🎉 All missing files added!');
console.log('\nThe server should reload automatically.');
console.log('Refresh your browser: http://localhost:3000\n');
