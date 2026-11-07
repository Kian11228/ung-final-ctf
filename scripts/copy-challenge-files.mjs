#!/usr/bin/env node
/**
 * Copies each challenge's assets/ folder into public/challenge-files/<slug>/ so the
 * static export can serve them for download. Runs automatically before `npm run build`
 * and `npm run dev`.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const contentDir = path.join(root, 'content', 'challenges');
const outDir = path.join(root, 'public', 'challenge-files');

fs.rmSync(outDir, { recursive: true, force: true });

for (const slug of fs.readdirSync(contentDir)) {
  const assets = path.join(contentDir, slug, 'assets');
  if (!fs.existsSync(assets)) continue;

  fs.cpSync(assets, path.join(outDir, slug), {
    recursive: true,
    filter: (src) => !path.basename(src).startsWith('.'),
  });
}

console.log('Challenge files copied to public/challenge-files/');
