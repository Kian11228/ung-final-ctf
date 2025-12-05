#!/usr/bin/env node
/**
 * EXPERT-LEVEL CTF Platform Upgrade
 * This creates a production-ready, advanced platform
 * Run with: node expert-upgrade.js
 */

const fs = require('fs');

console.log('🚀 Creating EXPERT-LEVEL CTF Platform...\n');

// Advanced lib/content.ts with full MDX support
fs.writeFileSync('lib/content.ts', `import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { challengeFrontmatterSchema, type ChallengeFrontmatter } from './schema';

export interface Challenge {
  slug: string;
  frontmatter: ChallengeFrontmatter;
  content: string;
  excerpt?: string;
}

const contentDir = path.join(process.cwd(), 'content/challenges');

export function getAllChallenges(): Challenge[] {
  if (!fs.existsSync(contentDir)) return [];

  const challengeDirs = fs.readdirSync(contentDir);
  const challenges: Challenge[] = [];

  for (const dir of challengeDirs) {
    const challengePath = path.join(contentDir, dir);
    const stat = fs.statSync(challengePath);
    if (!stat.isDirectory()) continue;

    const mdxPath = path.join(challengePath, 'index.mdx');
    if (!fs.existsSync(mdxPath)) continue;

    const fileContents = fs.readFileSync(mdxPath, 'utf8');
    const { data, content } = matter(fileContents);

    try {
      const frontmatter = challengeFrontmatterSchema.parse(data);
      const excerpt = content.slice(0, 200).replace(/[#*]/g, '').trim();
      
      challenges.push({ slug: dir, frontmatter, content, excerpt });
    } catch (error) {
      console.error(\`Error parsing \${dir}:\`, error);
    }
  }

  return challenges.sort(
    (a, b) => new Date(b.frontmatter.createdAt).getTime() - new Date(a.frontmatter.createdAt).getTime()
  );
}

export function getChallengeBySlug(slug: string): Challenge | null {
  const challengePath = path.join(contentDir, slug, 'index.mdx');
  if (!fs.existsSync(challengePath)) return null;

  const fileContents = fs.readFileSync(challengePath, 'utf8');
  const { data, content } = matter(fileContents);

  try {
    const frontmatter = challengeFrontmatterSchema.parse(data);
    const excerpt = content.slice(0, 200).replace(/[#*]/g, '').trim();
    return { slug, frontmatter, content, excerpt };
  } catch (error) {
    console.error(\`Error parsing \${slug}:\`, error);
    return null;
  }
}

export function getChallengesByCategory(category: string): Challenge[] {
  return getAllChallenges().filter((c) => c.frontmatter.category === category);
}

export function getCategories(): string[] {
  const challenges = getAllChallenges();
  return Array.from(new Set(challenges.map((c) => c.frontmatter.category)));
}

export function getTags(): string[] {
  const challenges = getAllChallenges();
  const tags = challenges.flatMap((c) => c.frontmatter.tags);
  return Array.from(new Set(tags)).sort();
}

export function getTotalPoints(): number {
  return getAllChallenges().reduce((sum, c) => sum + c.frontmatter.points, 0);
}

export function getStats() {
  const challenges = getAllChallenges();
  const categories = getCategories();
  const difficulties = { easy: 0, medium: 0, hard: 0 };
  
  challenges.forEach(c => {
    difficulties[c.frontmatter.difficulty]++;
  });

  return {
    total: challenges.length,
    totalPoints: getTotalPoints(),
    categories: categories.length,
    byCategory: categories.map(cat => ({
      name: cat,
      count: challenges.filter(c => c.frontmatter.category === cat).length
    })),
    byDifficulty: difficulties
  };
}`);

// Enhanced app/page.tsx with better design
fs.writeFileSync('app/page.tsx', `import Link from 'next/link';
import { siteConfig } from '@/site.config';
import { getAllChallenges, getTotalPoints, getStats } from '@/lib/content';
import { ArrowRight, Target, Trophy, Shield, Zap } from 'lucide-react';

export default function Home() {
  const stats = getStats();
  
  const features = [
    { icon: Target, title: 'Real-World Scenarios', desc: 'Challenges based on actual security incidents' },
    { icon: Shield, title: 'Sequential Unlocking', desc: 'Progress through increasing difficulty levels' },
    { icon: Zap, title: 'Instant Feedback', desc: 'Verify your solutions immediately' },
  ];

  return (
    <div className="container mx-auto max-w-screen-2xl px-4">
      {/* Hero with Gradient */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-5" />
        
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium">
            <Shield className="h-4 w-4" />
            <span>UNG Cybersecurity Capstone</span>
          </div>
          
          <h1 className="mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl md:text-7xl">
            {siteConfig.name}
          </h1>
          
          <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
            {siteConfig.tagline}
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link 
              href="/challenges"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-8 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
            >
              Start Solving
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link 
              href="/about"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-input bg-background px-8 text-sm font-semibold transition-all hover:bg-accent"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-xl hover:shadow-primary/5">
          <div className="absolute right-4 top-4 text-6xl opacity-5 transition-all group-hover:scale-110 group-hover:opacity-10">
            🎯
          </div>
          <div className="relative">
            <p className="text-3xl font-bold">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Challenges</p>
          </div>
        </div>
        
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-xl hover:shadow-primary/5">
          <div className="absolute right-4 top-4 text-6xl opacity-5 transition-all group-hover:scale-110 group-hover:opacity-10">
            🏆
          </div>
          <div className="relative">
            <p className="text-3xl font-bold">{stats.totalPoints}</p>
            <p className="text-sm text-muted-foreground">Total Points</p>
          </div>
        </div>
        
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-xl hover:shadow-primary/5">
          <div className="absolute right-4 top-4 text-6xl opacity-5 transition-all group-hover:scale-110 group-hover:opacity-10">
            📚
          </div>
          <div className="relative">
            <p className="text-3xl font-bold">{stats.categories}</p>
            <p className="text-sm text-muted-foreground">Categories</p>
          </div>
        </div>
        
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-xl hover:shadow-primary/5">
          <div className="absolute right-4 top-4 text-6xl opacity-5 transition-all group-hover:scale-110 group-hover:opacity-10">
            ⚡
          </div>
          <div className="relative">
            <p className="text-3xl font-bold">{stats.byDifficulty.hard}</p>
            <p className="text-sm text-muted-foreground">Hard Challenges</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mt-20">
        <h2 className="mb-8 text-center text-3xl font-bold">Why Choose This Platform</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <div key={i} className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-all group-hover:bg-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="mt-20">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Challenge Categories</h2>
            <p className="text-muted-foreground">Master all domains of cybersecurity</p>
          </div>
          <Link 
            href="/challenges" 
            className="text-sm font-medium text-primary hover:underline"
          >
            View All →
          </Link>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.categories.map((category) => {
            const catStats = stats.byCategory.find(c => c.name === category.id) || { count: 0 };
            return (
              <Link
                key={category.id}
                href={\`/challenges?category=\${category.id}\`}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={\`h-3 w-3 rounded-full \${category.color}\`} />
                    <h3 className="font-semibold transition-colors group-hover:text-primary">
                      {category.name}
                    </h3>
                  </div>
                  <span className="text-sm text-muted-foreground">{catStats.count}</span>
                </div>
                <div className="mt-4 h-1 w-0 rounded-full bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-20 mb-20 rounded-3xl border border-border bg-gradient-to-br from-card to-card/50 p-12 text-center">
        <h2 className="mb-4 text-3xl font-bold">Ready to Begin?</h2>
        <p className="mb-8 text-lg text-muted-foreground">
          Test your skills across {stats.total} real-world security challenges
        </p>
        <Link 
          href="/challenges"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-8 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105"
        >
          Browse Challenges
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}`);

console.log('✅ Enhanced homepage created!');
console.log('✅ Advanced content system created!');
console.log('\n📦 Installing additional dependencies...');

try {
  const { execSync } = require('child_process');
  execSync('npm install framer-motion lucide-react', { stdio: 'inherit' });
  console.log('\n✅ Dependencies installed!');
} catch (error) {
  console.log('\n⚠️  Please run: npm install framer-motion lucide-react');
}

console.log('\n🎉 EXPERT upgrade complete!');
console.log('\nRestart your server to see the changes:');
console.log('  1. Press Ctrl+C to stop');
console.log('  2. Run: npm run dev');
console.log('  3. Visit: http://localhost:3000\n');
