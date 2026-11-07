#!/usr/bin/env node
/**
 * Generates per-variant flags for every challenge.
 *
 *   npm run flags:generate                 # create flags for challenges that have none yet
 *   npm run flags:generate -- --force      # replace ALL flags with new ones
 *   npm run flags:generate -- --variants 6 # pool size for newly generated challenges
 *
 * What it does:
 *   1. Keeps the instructor answer key in flags.local.json (git-ignored, never publish it).
 *   2. Writes only the salted SHA-256 hash of each variant into the challenge's
 *      index.mdx frontmatter (flag.variants).
 *   3. Creates content/challenges/<slug>/assets/variants/<variant-id>/ folders (variant-a, variant-b, ...). Files placed in a
 *      variant folder are only offered to students assigned that variant, so the flag
 *      inside them must be that variant's flag.
 *
 * Re-running without --force is safe: existing flags are kept and their hashes rewritten.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const contentDir = path.join(root, 'content', 'challenges');
const answerKeyPath = path.join(root, 'flags.local.json');

const args = process.argv.slice(2);
const force = args.includes('--force');
const variantsArg = args.indexOf('--variants');
const variantCount = variantsArg >= 0 ? Number(args[variantsArg + 1]) : 4;

if (!Number.isInteger(variantCount) || variantCount < 2 || variantCount > 26) {
  console.error('--variants must be an integer from 2 to 26');
  process.exit(1);
}

// Descriptive text for each challenge's flags. The random suffix is what makes
// each variant secret, so this text is safe to keep in the repository.
const flagBases = {
  'network-breach': 'dns_exfiltration_c2_beacon_detected',
  'weak-crypto': 'weak_rsa_small_primes_factored_p_q',
  'disk-forensics': 'registry_persistence_appdata_scheduled_task',
  'web-sqli': 'sql_injection_union_based_admin_bypass',
  'malware-analysis': 'c2_domain_obfuscated_xor_key_0x42',
  'cloud-s3': 's3_public_bucket_leaked_credentials_iam',
  'linux-privesc': 'root_privilege_suid_binary_gtfobins',
  'grc-compliance': 'nist_csf_identify_protect_detect_respond_recover',
};

// 16 hex characters = 64 random bits. The salt and hashes are public on a static
// site, so the suffix must be long enough that guessing it offline is infeasible.
const SUFFIX_BYTES = 8;

const sha256 = (text) => crypto.createHash('sha256').update(text).digest('hex');

function loadAnswerKey() {
  if (!fs.existsSync(answerKeyPath)) return {};
  const parsed = JSON.parse(fs.readFileSync(answerKeyPath, 'utf8'));
  return parsed.challenges ?? {};
}

function readFrontmatterValue(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^\\s+${key}:\\s*"?([^"\\n]*)"?\\s*$`, 'm'));
  return match ? match[1] : undefined;
}

function replaceFlagBlock(source, { format, salt, variants }) {
  const fmMatch = source.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) throw new Error('missing frontmatter');

  const frontmatter = fmMatch[1];
  const lines = frontmatter.split('\n');
  const start = lines.findIndex((line) => /^flag:\s*$/.test(line));
  if (start === -1) throw new Error('missing flag: block');

  let end = start + 1;
  while (end < lines.length && /^\s+/.test(lines[end])) end += 1;

  const block = [
    'flag:',
    `  format: ${JSON.stringify(format)}`,
    `  salt: ${JSON.stringify(salt)}`,
    '  variants:',
    ...variants.flatMap((v) => [`    - id: ${JSON.stringify(v.id)}`, `      sha256: ${JSON.stringify(v.sha256)}`]),
  ];

  lines.splice(start, end - start, ...block);
  return source.replace(fmMatch[0], `---\n${lines.join('\n')}\n---`);
}

const answerKey = loadAnswerKey();
const slugs = fs
  .readdirSync(contentDir)
  .filter((slug) => fs.existsSync(path.join(contentDir, slug, 'index.mdx')))
  .sort();

for (const slug of slugs) {
  const mdxPath = path.join(contentDir, slug, 'index.mdx');
  const source = fs.readFileSync(mdxPath, 'utf8');
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';

  const format = readFrontmatterValue(frontmatter, 'format') ?? 'ung{.*}';
  const salt =
    answerKey[slug]?.salt ?? readFrontmatterValue(frontmatter, 'salt') ?? `ung_salt_${slug}_${crypto.randomBytes(4).toString('hex')}`;

  let entry = answerKey[slug];
  if (force || !entry) {
    const base = flagBases[slug] ?? slug.replace(/[^a-z0-9]+/gi, '_').toLowerCase();
    entry = {
      salt,
      variants: Array.from({ length: variantCount }, (_, i) => ({
        id: `variant-${String.fromCharCode(97 + i)}`,
        flag: `ung{${base}_${crypto.randomBytes(SUFFIX_BYTES).toString('hex')}}`,
      })),
    };
  }

  const pattern = new RegExp(`^(?:${format})$`);
  for (const variant of entry.variants) {
    if (!pattern.test(variant.flag)) {
      throw new Error(`${slug} ${variant.id}: flag does not match format ${format}`);
    }
  }

  answerKey[slug] = entry;

  const variants = entry.variants.map((v) => ({ id: v.id, sha256: sha256(entry.salt + v.flag) }));
  fs.writeFileSync(mdxPath, replaceFlagBlock(source, { format, salt: entry.salt, variants }));

  for (const v of entry.variants) {
    const dir = path.join(contentDir, slug, 'assets', 'variants', v.id);
    fs.mkdirSync(dir, { recursive: true });
    const keep = path.join(dir, '.gitkeep');
    if (fs.readdirSync(dir).length === 0) fs.writeFileSync(keep, '');
  }

  console.log(`${slug}: ${entry.variants.length} variants`);
}

fs.writeFileSync(
  answerKeyPath,
  JSON.stringify(
    {
      warning: 'Instructor answer key. Do not commit or publish this file.',
      generatedAt: new Date().toISOString(),
      challenges: answerKey,
    },
    null,
    2
  ) + '\n'
);

console.log(`\nAnswer key written to ${path.relative(root, answerKeyPath)} (git-ignored).`);
