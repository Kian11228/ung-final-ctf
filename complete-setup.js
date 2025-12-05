#!/usr/bin/env node
/**
 * Complete CTF Platform Setup
 * Creates ALL remaining files
 * Run with: node complete-setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Creating all remaining files...\n');

const files = {
  // Config files
  'tailwind.config.ts': `import type { Config } from 'tailwindcss';
const config: Config = {
  darkMode: 'class',
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
      },
      borderRadius: { lg: 'var(--radius)', md: 'calc(var(--radius) - 2px)', sm: 'calc(var(--radius) - 4px)' },
    },
  },
  plugins: [],
};
export default config;`,

  'postcss.config.js': `module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };`,

  '.prettierrc': `{ "semi": true, "singleQuote": true, "tabWidth": 2, "trailingComma": "es5", "printWidth": 100 }`,

  '.eslintrc.cjs': `module.exports = { extends: ['next/core-web-vitals'] };`,

  // App files
  'app/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}
@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground; }
}
pre { @apply overflow-x-auto rounded-lg bg-muted p-4; }
code { @apply rounded bg-muted px-1.5 py-0.5 font-mono text-sm; }
pre code { @apply bg-transparent p-0; }`,

  'app/layout.tsx': `import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/site.config';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: \`%s | \${siteConfig.name}\` },
  description: siteConfig.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
            <div className="container flex h-16 items-center justify-between">
              <Link href="/" className="text-xl font-bold">{siteConfig.name}</Link>
              <nav className="hidden md:flex md:gap-6">
                <Link href="/challenges" className="text-sm font-medium hover:text-primary">Challenges</Link>
                <Link href="/scoreboard" className="text-sm font-medium hover:text-primary">Scoreboard</Link>
                <Link href="/about" className="text-sm font-medium hover:text-primary">About</Link>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t py-6">
            <div className="container text-center text-sm text-muted-foreground">
              Built for security education.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}`,

  'app/page.tsx': `import Link from 'next/link';
import { siteConfig } from '@/site.config';

export default function Home() {
  return (
    <div className="container py-12">
      <section className="flex flex-col items-center justify-center space-y-6 py-24 text-center">
        <h1 className="text-6xl font-bold tracking-tighter">{siteConfig.name}</h1>
        <p className="max-w-[700px] text-xl text-muted-foreground">{siteConfig.tagline}</p>
        <Link href="/challenges" className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Start Solving
        </Link>
      </section>
    </div>
  );
}`,

  'app/challenges/page.tsx': `export default function ChallengesPage() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Challenges</h1>
      <p className="text-muted-foreground">Challenges will appear here once you add content!</p>
      <p className="mt-4">Run: <code className="bg-muted px-2 py-1 rounded">npm run scaffold:challenge</code></p>
    </div>
  );
}`,

  'app/scoreboard/page.tsx': `export default function ScoreboardPage() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-4">Scoreboard</h1>
      <p className="text-muted-foreground">Local scoreboard - solve challenges to see your score!</p>
    </div>
  );
}`,

  'app/about/page.tsx': `import { siteConfig } from '@/site.config';

export default function AboutPage() {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-4xl font-bold mb-8">About {siteConfig.name}</h1>
      <div className="prose prose-neutral dark:prose-invert">
        <p>This is a CTF platform for security training and education.</p>
        <h2>Getting Started</h2>
        <p>Browse challenges, submit flags, and track your progress on the scoreboard.</p>
      </div>
    </div>
  );
}`,

  // Lib files
  'lib/utils.ts': `import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`,

  'lib/content.ts': `import fs from 'fs';
import path from 'path';

export interface Challenge {
  slug: string;
  title: string;
}

export function getAllChallenges(): Challenge[] {
  const contentDir = path.join(process.cwd(), 'content/challenges');
  if (!fs.existsSync(contentDir)) return [];
  return [];
}`,

  // Public files
  'public/robots.txt': `User-agent: *
Allow: /`,

};

console.log('Creating files...');
let count = 0;

Object.entries(files).forEach(([filepath, content]) => {
  const dir = path.dirname(filepath);
  if (dir !== '.') {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filepath, content);
  count++;
  console.log(`  ✓ ${filepath}`);
});

console.log(`\n✅ Created ${count} files!`);
console.log('\n🎉 Setup complete!');
console.log('\nNow run:');
console.log('  npm run dev');
console.log('\nThen visit: http://localhost:3000\n');
