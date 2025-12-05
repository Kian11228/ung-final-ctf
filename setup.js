#!/usr/bin/env node

/**
 * CTF Platform Setup Script
 * Run with: node setup.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up CTF Platform...\n');

// Files to create
const files = {
  'package.json': `{
  "name": "ctf-platform",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "test": "vitest",
    "scaffold:challenge": "tsx scripts/scaffold-challenge.ts",
    "hash:assets": "tsx scripts/hash-assets.ts"
  },
  "dependencies": {
    "next": "14.2.13",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "next-mdx-remote": "^5.0.0",
    "gray-matter": "^4.0.3",
    "framer-motion": "^11.5.4",
    "lucide-react": "^0.441.0",
    "zod": "^3.23.8",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.2",
    "class-variance-authority": "^0.7.0",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-select": "^2.1.1",
    "@radix-ui/react-tabs": "^1.1.0",
    "rehype-highlight": "^7.0.0",
    "rehype-slug": "^6.0.0",
    "remark-gfm": "^4.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.5.5",
    "@types/react": "^18.3.8",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.6.2",
    "tailwindcss": "^3.4.12",
    "postcss": "^8.4.47",
    "autoprefixer": "^10.4.20",
    "eslint": "^8.57.1",
    "eslint-config-next": "14.2.13",
    "prettier": "^3.3.3",
    "prettier-plugin-tailwindcss": "^0.6.6",
    "vitest": "^2.1.1",
    "@vitejs/plugin-react": "^4.3.1",
    "tsx": "^4.19.1",
    "prompts": "^2.4.2",
    "@types/prompts": "^2.4.9"
  }
}`,

  '.gitignore': `node_modules
.next
out
.DS_Store
*.pem
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.env*.local
.vercel
*.tsbuildinfo
next-env.d.ts`,

  'README.md': `# CTF Platform

Run \`npm install\` then \`npm run dev\` to start!

Visit http://localhost:3000
`,

  'next.config.mjs': `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};
export default nextConfig;`,

  'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`,

  'site.config.ts': `export const siteConfig = {
  name: 'UNG CTF Platform',
  tagline: 'Challenge Yourself. Master Security.',
  description: 'A comprehensive CTF platform for university security training.',
  url: 'https://yourusername.github.io/ctf-platform',
  theme: { defaultMode: 'dark' as const },
  flag: {
    format: /^ung\\{[a-zA-Z0-9_-]+\\}$/,
    prefix: 'ung',
    hint: 'Flags follow the format: ung{...}',
  },
  scoring: {
    enableScoreboard: true,
    hintPenalty: 10,
  },
  categories: [
    { id: 'hardware', name: 'Hardware/Embedded', color: 'bg-red-500' },
    { id: 'forensics', name: 'Forensics', color: 'bg-blue-500' },
    { id: 'reversing', name: 'Reversing', color: 'bg-purple-500' },
    { id: 'web', name: 'Web', color: 'bg-green-500' },
    { id: 'crypto', name: 'Crypto', color: 'bg-yellow-500' },
    { id: 'misc', name: 'Misc', color: 'bg-gray-500' },
  ],
  difficulty: {
    easy: { label: 'Easy', color: 'text-green-500', bgColor: 'bg-green-500/10' },
    medium: { label: 'Medium', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
    hard: { label: 'Hard', color: 'text-red-500', bgColor: 'bg-red-500/10' },
  },
  links: {
    github: 'https://github.com/yourusername/ctf-platform',
    issues: 'https://github.com/yourusername/ctf-platform/issues',
  },
  seo: {
    keywords: ['CTF', 'Capture The Flag', 'Security', 'Cybersecurity'],
    ogImage: '/og-default.png',
  },
};`
};

// Create directories
const dirs = [
  'app/challenges/[slug]',
  'app/scoreboard',
  'app/about',
  'app/api/og',
  'components/ui',
  'lib',
  'scripts',
  'tests',
  'content/challenges',
  'public',
  '.github/workflows'
];

console.log('📁 Creating directories...');
dirs.forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
  console.log(`  ✓ ${dir}`);
});

console.log('\n📝 Creating configuration files...');
Object.entries(files).forEach(([filename, content]) => {
  fs.writeFileSync(filename, content);
  console.log(`  ✓ ${filename}`);
});

console.log('\n✅ Basic structure created!');
console.log('\n📦 Installing dependencies...');
console.log('This may take a few minutes...\n');

try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('\n✅ Dependencies installed!');
} catch (error) {
  console.log('\n⚠️  Please run "npm install" manually');
}

console.log('\n🎉 Setup complete!');
console.log('\nNext steps:');
console.log('1. I will provide you with the remaining files');
console.log('2. Then run: npm run dev');
console.log('3. Visit: http://localhost:3000');
console.log('\nReady for the next files!');
