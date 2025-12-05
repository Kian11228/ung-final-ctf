import fs from 'fs';
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
      console.error(`Error parsing ${dir}:`, error);
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
    console.error(`Error parsing ${slug}:`, error);
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
}