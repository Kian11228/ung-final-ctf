import { z } from 'zod';

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
