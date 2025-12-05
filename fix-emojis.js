#!/usr/bin/env node
/**
 * Fix emoji visibility and add better hover effects
 */

const fs = require('fs');

console.log('🎨 Fixing emoji visibility and hover effects...\n');

// Update app/page.tsx with better styling
fs.writeFileSync('app/page.tsx', `import Link from 'next/link';
import { siteConfig } from '@/site.config';
import { getAllChallenges, getTotalPoints, getStats } from '@/lib/content';
import { ArrowRight, Target, Trophy, Shield, Zap, BookOpen, Award } from 'lucide-react';

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

      {/* Stats Grid with Better Icons */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 blur-2xl transition-all group-hover:scale-150" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 transition-all group-hover:bg-blue-500/20 group-hover:scale-110">
              <Target className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Challenges</p>
            </div>
          </div>
        </div>
        
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 blur-2xl transition-all group-hover:scale-150" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/10 transition-all group-hover:bg-yellow-500/20 group-hover:scale-110">
              <Trophy className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-3xl font-bold">{stats.totalPoints}</p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
          </div>
        </div>
        
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/20 blur-2xl transition-all group-hover:scale-150" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 transition-all group-hover:bg-purple-500/20 group-hover:scale-110">
              <BookOpen className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-3xl font-bold">{stats.categories}</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
          </div>
        </div>
        
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 blur-2xl transition-all group-hover:scale-150" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10 transition-all group-hover:bg-red-500/20 group-hover:scale-110">
              <Award className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-3xl font-bold">{stats.byDifficulty.hard}</p>
              <p className="text-sm text-muted-foreground">Hard Challenges</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mt-20">
        <h2 className="mb-8 text-center text-3xl font-bold">Why Choose This Platform</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <div key={i} className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-all group-hover:bg-primary/20 group-hover:scale-110">
                <feature.icon className="h-6 w-6 text-primary transition-all group-hover:scale-110" />
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
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={\`h-3 w-3 rounded-full \${category.color} transition-all group-hover:scale-125 group-hover:shadow-lg\`} />
                    <h3 className="font-semibold transition-colors group-hover:text-primary">
                      {category.name}
                    </h3>
                  </div>
                  <span className="text-sm text-muted-foreground">{catStats.count}</span>
                </div>
                <div className="mt-4 h-1 w-0 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full" />
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

console.log('✅ Fixed stat cards with Lucide icons');
console.log('✅ Added colorful backgrounds that glow on hover');
console.log('✅ Icons now scale and brighten on hover');
console.log('✅ Added smooth transitions everywhere');

console.log('\n🎨 Visual improvements complete!');
console.log('\nRefresh your browser to see the changes!\n');
