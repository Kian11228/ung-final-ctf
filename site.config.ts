export const siteConfig = {
  name: 'UNG CTF Platform',
  tagline: 'Challenge Yourself. Master Security.',
  description: 'A comprehensive CTF platform for university security training.',
  url: 'https://yourusername.github.io/ctf-platform',
  theme: { defaultMode: 'dark' as const },
  flag: {
    format: /^ung\{[a-zA-Z0-9_-]+\}$/,
    prefix: 'ung',
    hint: 'Flags follow the format: ung{...}',
  },
  scoring: {
    enableScoreboard: true,
    hintPenalty: 10,
  },
  categories: [
    { id: 'hardware', name: 'Hardware/Embedded', color: 'bg-red-500' },
    { id: 'forensics', name: 'Forensics', color: 'bg-blue-500' },
    { id: 'reversing', name: 'Reversing', color: 'bg-purple-500' },
    { id: 'web', name: 'Web', color: 'bg-green-500' },
    { id: 'crypto', name: 'Crypto', color: 'bg-yellow-500' },
    { id: 'misc', name: 'Misc', color: 'bg-gray-500' },
  ],
  difficulty: {
    easy: { label: 'Easy', color: 'text-green-500', bgColor: 'bg-green-500/10' },
    medium: { label: 'Medium', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
    hard: { label: 'Hard', color: 'text-red-500', bgColor: 'bg-red-500/10' },
  },
  links: {
    github: 'https://github.com/yourusername/ctf-platform',
    issues: 'https://github.com/yourusername/ctf-platform/issues',
  },
  seo: {
    keywords: ['CTF', 'Capture The Flag', 'Security', 'Cybersecurity'],
    ogImage: '/og-default.png',
  },
};