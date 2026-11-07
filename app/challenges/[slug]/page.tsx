import Link from 'next/link';
import { getChallengeBySlug, getAllChallenges, getChallengeFiles } from '@/lib/content';
import { ChallengeFiles } from '@/components/challenge-files';
import { FlagSubmit } from '@/components/flag-submit';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/site.config';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { Download, Eye, Flag, Calendar, User, Award } from 'lucide-react';

export async function generateStaticParams() {
  const challenges = getAllChallenges();
  return challenges.map((challenge) => ({
    slug: challenge.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const challenge = getChallengeBySlug(params.slug);
  if (!challenge) return { title: 'Challenge Not Found' };
  return { title: challenge.frontmatter.title };
}

export default function ChallengePage({ params }: { params: { slug: string } }) {
  const challenge = getChallengeBySlug(params.slug);
  if (!challenge) notFound();

  const { frontmatter, content } = challenge;
  const files = getChallengeFiles(params.slug);
  const category = siteConfig.categories.find((c) => c.id === frontmatter.category);

  const difficultyConfig = {
    easy: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/20' },
    medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/20' },
    hard: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20' },
  };

  const diff = difficultyConfig[frontmatter.difficulty];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      {/* Back button */}
      <Link href="/challenges" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        ← Back to Challenges
      </Link>

      {/* Header */}
      <div className="mb-8 space-y-6 rounded-2xl border border-border bg-card p-8">
        <div className="flex flex-wrap items-center gap-2">
          {category && (
            <span className={`rounded-full px-3 py-1 text-xs font-medium text-white ${category.color}`}>
              {category.name}
            </span>
          )}
          <span className={`rounded-full border px-3 py-1 text-xs font-medium ${diff.bg} ${diff.text} ${diff.border}`}>
            {frontmatter.difficulty.charAt(0).toUpperCase() + frontmatter.difficulty.slice(1)}
          </span>
        </div>

        <h1 className="text-4xl font-bold">{frontmatter.title}</h1>

        <div className="flex flex-wrap gap-2">
          {frontmatter.tags.map((tag) => (
            <span key={tag} className="rounded-lg bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{frontmatter.author}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date(frontmatter.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 font-semibold text-primary">
            <Award className="h-4 w-4" />
            <span>{frontmatter.points} points</span>
          </div>
        </div>
      </div>

      {/* Downloads Section */}
      <div className="mb-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
          <Download className="h-6 w-6" />
          Challenge Files
        </h2>
        <ChallengeFiles
          challengeId={frontmatter.id}
          variants={frontmatter.flag.variants}
          sharedFiles={files.shared}
          variantFiles={files.byVariant}
        />
      </div>

      {/* Challenge Content */}
      <div className="mb-8 rounded-2xl border border-border bg-card p-8">
        <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-p:text-muted-foreground prose-strong:text-foreground prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-pre:bg-muted">
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
      </div>

      {/* Hints Section */}
      {frontmatter.hints && frontmatter.hints.length > 0 && (
        <div className="mb-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
            <Eye className="h-6 w-6" />
            Hints
          </h2>
          <div className="space-y-3">
            {frontmatter.hints.map((hint, index) => (
              <details key={index} className="group rounded-lg border border-border bg-background">
                <summary className="cursor-pointer p-4 font-medium transition-colors hover:bg-accent">
                  <span className="select-none">💡 Hint {index + 1} (Click to reveal)</span>
                </summary>
                <div className="border-t border-border p-4 text-sm text-muted-foreground">
                  {hint}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Flag Submission */}
      <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
          <Flag className="h-6 w-6" />
          Submit Flag
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Found the flag? Submit it below to complete the challenge and earn <strong>{frontmatter.points} points</strong>.
        </p>
        
        <FlagSubmit
          challengeId={frontmatter.id}
          points={frontmatter.points}
          format={frontmatter.flag.format}
          salt={frontmatter.flag.salt}
          variants={frontmatter.flag.variants}
        />

        <div className="mt-4 rounded-lg bg-blue-500/10 p-4">
          <p className="text-xs text-blue-500">
            <strong>Note:</strong> Flags are validated against secure hashes, and each student is assigned their
            own flag variant. Your progress is saved in this browser.
          </p>
        </div>
      </div>
    </div>
  );
}