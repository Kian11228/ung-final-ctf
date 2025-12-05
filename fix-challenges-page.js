#!/usr/bin/env node
const fs = require('fs');

console.log('🔧 Fixing challenges page...\n');

fs.writeFileSync('app/challenges/page.tsx', `import { getAllChallenges } from '@/lib/content';
import { ChallengeCard } from '@/components/challenge-card';

export default function ChallengesPage() {
  const challenges = getAllChallenges();

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-12">
      <div className="space-y-2 pb-8">
        <h1 className="text-4xl font-bold">Challenges</h1>
        <p className="text-muted-foreground">
          {challenges.length} challenges available
        </p>
      </div>

      {challenges.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <div className="text-6xl">🎯</div>
            <h3 className="text-2xl font-bold">No Challenges Yet</h3>
            <p className="text-muted-foreground">
              Run the challenge creation script to add challenges!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge.slug} challenge={challenge} />
          ))}
        </div>
      )}
    </div>
  );
}`);

console.log('✅ Fixed challenges page!');
console.log('\nNow checking if ChallengeCard component exists...\n');

// Check if component exists, if not create it
if (!fs.existsSync('components/challenge-card.tsx')) {
  console.log('Creating ChallengeCard component...');
  
  fs.writeFileSync('components/challenge-card.tsx', `'use client';
import Link from 'next/link';
import type { Challenge } from '@/lib/content';
import { siteConfig } from '@/site.config';

interface ChallengeCardProps {
  challenge: Challenge;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const { frontmatter, slug } = challenge;
  const category = siteConfig.categories.find((c) => c.id === frontmatter.category);

  const difficultyColors = {
    easy: 'bg-green-500/10 text-green-500 border-green-500/20',
    medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    hard: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <Link
      href={\`/challenges/\${slug}\`}
      className="group block rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="mb-4 flex items-center gap-2">
        {category && (
          <span className={\`rounded-full px-3 py-1 text-xs font-medium text-white \${category.color}\`}>
            {category.name}
          </span>
        )}
        <span className={\`rounded-full border px-3 py-1 text-xs font-medium \${difficultyColors[frontmatter.difficulty]}\`}>
          {frontmatter.difficulty.charAt(0).toUpperCase() + frontmatter.difficulty.slice(1)}
        </span>
      </div>

      <h3 className="mb-2 text-xl font-bold transition-colors group-hover:text-primary">
        {frontmatter.title}
      </h3>

      <div className="mb-4 flex flex-wrap gap-1">
        {frontmatter.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded bg-secondary px-2 py-1 text-xs text-secondary-foreground">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="font-semibold">{frontmatter.points} pts</span>
        <span className="text-sm text-primary transition-all group-hover:translate-x-1">
          View Challenge →
        </span>
      </div>
    </Link>
  );
}`);
  
  console.log('✅ Created ChallengeCard component!');
}

console.log('\n✨ All done! Refresh your browser.\n');
