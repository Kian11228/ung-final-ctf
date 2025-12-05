#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('🔧 Creating challenge detail page...\n');

// Create the [slug] directory
const slugDir = path.join(process.cwd(), 'app/challenges/[slug]');
fs.mkdirSync(slugDir, { recursive: true });

// Create the page.tsx file
fs.writeFileSync(path.join(slugDir, 'page.tsx'), `import { getChallengeBySlug, getAllChallenges } from '@/lib/content';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/site.config';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

export async function generateStaticParams() {
  const challenges = getAllChallenges();
  return challenges.map((challenge) => ({
    slug: challenge.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const challenge = getChallengeBySlug(params.slug);
  
  if (!challenge) {
    return { title: 'Challenge Not Found' };
  }

  return {
    title: challenge.frontmatter.title,
    description: challenge.excerpt || 'CTF Challenge',
  };
}

export default function ChallengePage({ params }: { params: { slug: string } }) {
  const challenge = getChallengeBySlug(params.slug);

  if (!challenge) {
    notFound();
  }

  const { frontmatter, content } = challenge;
  const category = siteConfig.categories.find((c) => c.id === frontmatter.category);

  const difficultyColors = {
    easy: 'bg-green-500/10 text-green-500 border-green-500/20',
    medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    hard: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      {/* Header */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {category && (
            <span className={\`rounded-full px-3 py-1 text-xs font-medium text-white \${category.color}\`}>
              {category.name}
            </span>
          )}
          <span className={\`rounded-full border px-3 py-1 text-xs font-medium \${difficultyColors[frontmatter.difficulty]}\`}>
            {frontmatter.difficulty.charAt(0).toUpperCase() + frontmatter.difficulty.slice(1)}
          </span>
        </div>

        <h1 className="text-4xl font-bold">{frontmatter.title}</h1>

        <div className="flex flex-wrap gap-2">
          {frontmatter.tags.map((tag) => (
            <span key={tag} className="rounded bg-secondary px-2 py-1 text-xs text-secondary-foreground">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span>👤 {frontmatter.author}</span>
          <span>📅 {new Date(frontmatter.createdAt).toLocaleDateString()}</span>
          <span className="font-semibold text-foreground">{frontmatter.points} points</span>
        </div>
      </div>

      {/* Challenge Content */}
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <MDXRemote
          source={content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeHighlight],
            },
          }}
        />
      </div>

      {/* Hints Section */}
      {frontmatter.hints && frontmatter.hints.length > 0 && (
        <div className="mb-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 text-2xl font-bold">💡 Hints</h2>
          <div className="space-y-2">
            {frontmatter.hints.map((hint, index) => (
              <details key={index} className="rounded-lg border border-border bg-background p-4">
                <summary className="cursor-pointer font-medium hover:text-primary">
                  Hint {index + 1} (Click to reveal)
                </summary>
                <p className="mt-2 text-muted-foreground">{hint}</p>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Flag Submission */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 text-2xl font-bold">🚩 Submit Flag</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Found the flag? Submit it below to complete the challenge.
        </p>
        
        <form className="space-y-4">
          <input
            type="text"
            placeholder="ung{your_flag_here}"
            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Submit Flag
          </button>
        </form>

        <div className="mt-4 rounded-lg bg-blue-500/10 p-4 text-sm">
          <p className="text-blue-500">
            <strong>Note:</strong> This is a demo platform. Flag validation will be implemented in the full version.
          </p>
        </div>
      </div>
    </div>
  );
}`);

console.log('✅ Created challenge detail page!');
console.log('\n✨ Now all challenge links should work!');
console.log('\nRefresh your browser and click on any challenge! 🚀\n');
