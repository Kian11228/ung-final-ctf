import { siteConfig } from '@/site.config';
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
}