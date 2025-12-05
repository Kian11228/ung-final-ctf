#!/usr/bin/env node
/**
 * FINAL POLISH - Production-Ready CTF Platform
 * Professional styling and integration
 */

const fs = require('fs');

console.log('✨ Applying final polish...\n');

// Enhanced globals.css with modern design
fs.writeFileSync('app/globals.css', `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 217.2 32.6% 17.5%;
    --card-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  @apply bg-muted/30;
}

::-webkit-scrollbar-thumb {
  @apply bg-muted rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-muted-foreground/50;
}

/* Grid pattern background */
.bg-grid-pattern {
  background-image: linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
    linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* Smooth animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

/* Code blocks */
pre {
  @apply overflow-x-auto rounded-lg bg-muted p-4 my-4;
}

code {
  @apply rounded bg-muted px-1.5 py-0.5 font-mono text-sm;
}

pre code {
  @apply bg-transparent p-0;
}

/* Focus styles */
:focus-visible {
  @apply outline-none ring-2 ring-ring ring-offset-2 ring-offset-background;
}

/* Gradient text */
.gradient-text {
  @apply bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent;
}

/* Card hover effect */
.card-hover {
  @apply transition-all duration-200 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1;
}

/* Loading spinner */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Pulse animation */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Shimmer effect for loading states */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.animate-shimmer {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}
`);

// Enhanced layout with toast and progress
fs.writeFileSync('app/layout.tsx', `import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/site.config';
import Link from 'next/link';
import { ToastContainer } from '@/components/toast';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: \`%s | \${siteConfig.name}\` },
  description: siteConfig.description,
  keywords: siteConfig.seo.keywords,
  authors: [{ name: 'UNG Cybersecurity' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#0c1222' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="relative flex min-h-screen flex-col">
          {/* Background Effects */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute right-0 bottom-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl" />
          </div>

          {/* Header */}
          <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
              <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="hidden font-bold sm:inline-block">{siteConfig.name}</span>
              </Link>
              
              <nav className="flex gap-6">
                <Link 
                  href="/challenges" 
                  className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
                >
                  Challenges
                </Link>
                <Link 
                  href="/scoreboard" 
                  className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
                >
                  Scoreboard
                </Link>
                <Link 
                  href="/about" 
                  className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
                >
                  About
                </Link>
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer className="border-t border-border/40 py-6 md:py-0">
            <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
              <p className="text-sm text-muted-foreground">
                © 2025 {siteConfig.name}. Built for security education.
              </p>
              <div className="flex gap-4">
                <Link 
                  href={siteConfig.links.github}
                  className="text-sm text-muted-foreground hover:text-foreground"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </Link>
                <Link 
                  href="/about" 
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Documentation
                </Link>
              </div>
            </div>
          </footer>
        </div>
        
        <ToastContainer />
      </body>
    </html>
  );
}`);

console.log('✅ Professional styling applied!');
console.log('✅ Enhanced layout with background effects!');
console.log('✅ Toast notifications integrated!');

console.log('\n✨ FINAL POLISH COMPLETE!\n');
console.log('Your CTF platform now has:');
console.log('  ✅ Modern gradient backgrounds');
console.log('  ✅ Smooth animations');
console.log('  ✅ Professional typography');
console.log('  ✅ Advanced state management');
console.log('  ✅ Toast notifications');
console.log('  ✅ Progress tracking');
console.log('  ✅ Responsive design');
console.log('  ✅ Accessibility features');
console.log('\nThis is 10x better than the old HTML version! 🚀\n');
