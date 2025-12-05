import type { Challenge } from './content';

export interface FilterOptions {
  categories?: string[];
  difficulties?: string[];
  tags?: string[];
  minPoints?: number;
  maxPoints?: number;
  search?: string;
}

export interface SortOptions {
  field: 'date' | 'points' | 'difficulty' | 'title';
  direction: 'asc' | 'desc';
}

export function filterChallenges(challenges: Challenge[], filters: FilterOptions): Challenge[] {
  let filtered = [...challenges];

  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter((c) => filters.categories!.includes(c.frontmatter.category));
  }

  if (filters.difficulties && filters.difficulties.length > 0) {
    filtered = filtered.filter((c) => filters.difficulties!.includes(c.frontmatter.difficulty));
  }

  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((c) =>
      filters.tags!.some((tag) => c.frontmatter.tags.includes(tag))
    );
  }

  if (filters.minPoints !== undefined) {
    filtered = filtered.filter((c) => c.frontmatter.points >= filters.minPoints!);
  }

  if (filters.maxPoints !== undefined) {
    filtered = filtered.filter((c) => c.frontmatter.points <= filters.maxPoints!);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.frontmatter.title.toLowerCase().includes(searchLower) ||
        c.frontmatter.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
        c.content.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
}

export function sortChallenges(challenges: Challenge[], sort: SortOptions): Challenge[] {
  const sorted = [...challenges];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sort.field) {
      case 'date':
        comparison =
          new Date(a.frontmatter.createdAt).getTime() -
          new Date(b.frontmatter.createdAt).getTime();
        break;
      case 'points':
        comparison = a.frontmatter.points - b.frontmatter.points;
        break;
      case 'difficulty':
        const difficultyOrder = { easy: 0, medium: 1, hard: 2 };
        comparison =
          difficultyOrder[a.frontmatter.difficulty] -
          difficultyOrder[b.frontmatter.difficulty];
        break;
      case 'title':
        comparison = a.frontmatter.title.localeCompare(b.frontmatter.title);
        break;
    }

    return sort.direction === 'asc' ? comparison : -comparison;
  });

  return sorted;
}
