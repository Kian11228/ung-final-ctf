'use client';
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
      href={`/challenges/${slug}`}
      className="group block rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="mb-4 flex items-center gap-2">
        {category && (
          <span className={`rounded-full px-3 py-1 text-xs font-medium text-white ${category.color}`}>
            {category.name}
          </span>
        )}
        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${difficultyColors[frontmatter.difficulty]}`}>
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
}