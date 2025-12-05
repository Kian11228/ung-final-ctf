import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/site.config';
import Link from 'next/link';
import { ToastContainer } from '@/components/toast';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
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
}