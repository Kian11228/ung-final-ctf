#!/usr/bin/env node
const fs = require('fs');

console.log('🔧 Applying final fixes...\n');

// 1. Fix text selection issue properly in globals.css
console.log('1. Fixing text selection issue...');
const currentCss = fs.readFileSync('app/globals.css', 'utf8');
const fixedCss = currentCss + `

/* CRITICAL: Disable text selection on ALL UI elements */
* {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  cursor: default;
}

/* ONLY allow text selection in actual content areas */
input, textarea, .prose, .prose * {
  user-select: text !important;
  -webkit-user-select: text !important;
  cursor: text;
}

/* Enable pointer cursor on interactive elements */
button, a, [role="button"] {
  cursor: pointer !important;
}

/* Disable selection on cards and UI components */
.card, [class*="card"], [class*="Card"] {
  user-select: none !important;
  -webkit-user-select: none !important;
}
`;
fs.writeFileSync('app/globals.css', fixedCss);
console.log('  ✓ Text selection fully disabled on UI elements');

// 2. Fix About page - remove "Need Help" section
console.log('2. Removing "Need Help" from About page...');
fs.writeFileSync('app/about/page.tsx', `import { siteConfig } from '@/site.config';
import { Shield, Target, BookOpen, Award } from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      icon: Shield,
      title: 'Real-World Security',
      description: 'Challenges based on actual security incidents and industry scenarios'
    },
    {
      icon: Target,
      title: 'Progressive Difficulty',
      description: 'From beginner-friendly to expert-level challenges'
    },
    {
      icon: BookOpen,
      title: 'Educational Focus',
      description: 'Learn industry-standard tools and methodologies'
    },
    {
      icon: Award,
      title: 'Professional Skills',
      description: 'Build portfolio-worthy security analysis capabilities'
    }
  ];

  const categories = [
    { name: 'Network Forensics', desc: 'PCAP analysis, protocol inspection, traffic monitoring' },
    { name: 'Cryptography', desc: 'Encryption breaking, key analysis, secure implementation' },
    { name: 'Digital Forensics', desc: 'Disk analysis, memory forensics, artifact recovery' },
    { name: 'Web Security', desc: 'SQL injection, XSS, authentication bypass techniques' },
    { name: 'Malware Analysis', desc: 'Reverse engineering, behavioral analysis, C2 extraction' },
    { name: 'Cloud Security', desc: 'AWS/Azure misconfigurations, IAM analysis' },
    { name: 'Penetration Testing', desc: 'Privilege escalation, exploitation, post-exploitation' },
    { name: 'GRC & Compliance', desc: 'NIST CSF, risk assessment, security frameworks' }
  ];

  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-12">
      {/* Hero */}
      <section className="mb-16 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium">
          <Shield className="h-4 w-4" />
          <span>UNG Cybersecurity Capstone Program</span>
        </div>
        <h1 className="mb-4 text-5xl font-bold">About {siteConfig.name}</h1>
        <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
          A comprehensive Capture The Flag platform designed for senior-level cybersecurity students
        </p>
      </section>

      {/* Mission */}
      <section className="mb-16 rounded-2xl border border-border bg-card p-8">
        <h2 className="mb-4 text-3xl font-bold">Our Mission</h2>
        <p className="text-lg text-muted-foreground">
          This platform provides hands-on experience with real-world security challenges, 
          preparing students for professional cybersecurity careers. Each challenge is carefully 
          crafted to reinforce course concepts and introduce industry-standard tools and methodologies.
        </p>
      </section>

      {/* Features */}
      <section className="mb-16">
        <h2 className="mb-8 text-3xl font-bold">Platform Features</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Challenge Categories */}
      <section className="mb-16">
        <h2 className="mb-8 text-3xl font-bold">Challenge Categories</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {categories.map((cat, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-2 font-semibold">{cat.name}</h3>
              <p className="text-sm text-muted-foreground">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Flag Format */}
      <section className="mb-16 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-8">
        <h2 className="mb-4 text-2xl font-bold">Flag Format</h2>
        <p className="mb-4 text-muted-foreground">
          All flags in this CTF follow a standard format for consistency:
        </p>
        <code className="block rounded-lg bg-background p-4 font-mono">
          ung&#123;descriptive_text_here&#125;
        </code>
        <p className="mt-4 text-sm text-muted-foreground">
          Example: <code className="rounded bg-background px-2 py-1">ung&#123;sql_injection_bypass_complete&#125;</code>
        </p>
      </section>

      {/* Rules */}
      <section>
        <h2 className="mb-8 text-3xl font-bold">Rules & Guidelines</h2>
        <div className="space-y-4 rounded-2xl border border-border bg-card p-8">
          <div>
            <h3 className="mb-2 font-semibold">Academic Integrity</h3>
            <p className="text-sm text-muted-foreground">
              Work individually unless instructed otherwise. Collaboration on understanding 
              concepts is encouraged, but flag sharing is prohibited.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Tool Usage</h3>
            <p className="text-sm text-muted-foreground">
              Use any tools and resources available to you. Learning to leverage professional 
              security tools is part of the educational experience.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Documentation</h3>
            <p className="text-sm text-muted-foreground">
              Document your methodology and findings. This practice is essential for professional 
              security work and will be valuable for your portfolio.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Ethical Conduct</h3>
            <p className="text-sm text-muted-foreground">
              All activities must remain within the scope of this platform. Do not attack 
              external systems or infrastructure.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}`);
console.log('  ✓ Removed "Need Help" section from About page');

// 3. Fix homepage to show correct category counts
console.log('3. Fixing homepage category counts...');
fs.writeFileSync('app/page.tsx', `import Link from 'next/link';
import { siteConfig } from '@/site.config';
import { ArrowRight, Target, Trophy, Shield, BookOpen } from 'lucide-react';

export default function Home() {
  // Hardcoded category counts based on our 8 challenges
  const categoryStats = {
    'hardware': 0,
    'forensics': 2, // network-breach, disk-forensics
    'reversing': 1, // malware-analysis
    'web': 2,       // cloud-s3, web-sqli
    'crypto': 1,    // weak-crypto
    'misc': 2       // linux-privesc, grc-compliance
  };

  return (
    <div className="container mx-auto max-w-screen-2xl px-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        
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
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-8 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105"
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
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-xl">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 blur-2xl transition-all group-hover:scale-150" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 transition-all group-hover:bg-blue-500/20 group-hover:scale-110">
              <Target className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-3xl font-bold">8</p>
              <p className="text-sm text-muted-foreground">Total Challenges</p>
            </div>
          </div>
        </div>
        
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-xl">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 blur-2xl transition-all group-hover:scale-150" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/10 transition-all group-hover:bg-yellow-500/20 group-hover:scale-110">
              <Trophy className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-3xl font-bold">2,250</p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
          </div>
        </div>
        
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-xl">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/20 blur-2xl transition-all group-hover:scale-150" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 transition-all group-hover:bg-purple-500/20 group-hover:scale-110">
              <BookOpen className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-3xl font-bold">5</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
          </div>
        </div>
        
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-xl">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 blur-2xl transition-all group-hover:scale-150" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10 transition-all group-hover:bg-red-500/20 group-hover:scale-110">
              <Shield className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-3xl font-bold">Senior</p>
              <p className="text-sm text-muted-foreground">Level</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mt-20">
        <h2 className="mb-8 text-center text-3xl font-bold">Why Choose This Platform</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Target, title: 'Real-World Scenarios', desc: 'Challenges based on actual security incidents' },
            { icon: Shield, title: 'Sequential Unlocking', desc: 'Progress through increasing difficulty levels' },
            { icon: BookOpen, title: 'Instant Feedback', desc: 'Verify your solutions immediately' }
          ].map((feature, i) => (
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
          {siteConfig.categories.filter(c => categoryStats[c.id] > 0).map((category) => (
            <Link
              key={category.id}
              href={\`/challenges?category=\${category.id}\`}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={\`h-3 w-3 rounded-full \${category.color} transition-all group-hover:scale-125\`} />
                  <h3 className="font-semibold transition-colors group-hover:text-primary">
                    {category.name}
                  </h3>
                </div>
                <span className="text-sm text-muted-foreground">{categoryStats[category.id]}</span>
              </div>
              <div className="mt-4 h-1 w-0 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20 mb-20 rounded-3xl border border-border bg-gradient-to-br from-card to-card/50 p-12 text-center">
        <h2 className="mb-4 text-3xl font-bold">Ready to Begin?</h2>
        <p className="mb-8 text-lg text-muted-foreground">
          Test your skills across 8 real-world security challenges
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
console.log('  ✓ Fixed category counts (only showing categories with challenges)');

console.log('\n✅ All fixes applied!\n');
console.log('Changes made:');
console.log('  ✓ Text selection COMPLETELY disabled on UI elements');
console.log('  ✓ Removed "Need Help" section');
console.log('  ✓ Homepage shows only categories with challenges (no zeros)');
console.log('  ✓ Category counts: Forensics(2), Web(2), Misc(2), Crypto(1), Reversing(1)');
console.log('\nRefresh your browser! 🚀\n');
