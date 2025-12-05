#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing all issues and making it professional...\n');

// 1. Fix text selection issue in globals.css
console.log('1. Fixing text selection...');
const globalsCss = fs.readFileSync('app/globals.css', 'utf8');
const updatedCss = globalsCss + `

/* Disable text selection on UI elements */
button, a, nav, header {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* Allow text selection in content areas */
p, h1, h2, h3, h4, h5, h6, li, span, div.prose {
  user-select: text;
  -webkit-user-select: text;
}

/* Prevent cursor change on non-interactive elements */
.no-select {
  user-select: none;
  cursor: default;
}
`;
fs.writeFileSync('app/globals.css', updatedCss);
console.log('  ✓ Text selection fixed');

// 2. Create professional About page
console.log('2. Creating professional About page...');
fs.writeFileSync('app/about/page.tsx', `import { siteConfig } from '@/site.config';
import { Shield, Target, BookOpen, Award, Users, Zap } from 'lucide-react';

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
      <section className="mb-16">
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

      {/* Contact */}
      <section className="rounded-2xl border border-border bg-card p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">Need Help?</h2>
        <p className="mb-6 text-muted-foreground">
          Questions about challenges or experiencing technical issues?
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-input bg-background px-6 text-sm font-medium transition-colors hover:bg-accent"
          >
            GitHub Repository
          </a>
          <a
            href={siteConfig.links.issues}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Report an Issue
          </a>
        </div>
      </section>
    </div>
  );
}`);
console.log('  ✓ Professional About page created');

// 3. Create sample challenge files
console.log('3. Creating downloadable challenge files...');
const challengesDir = path.join(process.cwd(), 'content/challenges');
const challenges = fs.readdirSync(challengesDir);

challenges.forEach(challengeDir => {
  const assetsPath = path.join(challengesDir, challengeDir, 'assets');
  if (fs.existsSync(assetsPath)) {
    // Create sample PCAP file description
    if (challengeDir === 'network-breach') {
      fs.writeFileSync(path.join(assetsPath, 'sample_traffic.txt'), 
`PCAP Analysis Challenge File
=============================

This file represents a network capture containing:
- DNS queries with exfiltration attempts
- HTTP traffic with C2 beacons
- Suspicious FTP data transfers

Tools Needed:
- Wireshark
- tshark
- CyberChef for decoding

Investigation Steps:
1. Filter for DNS traffic
2. Look for unusually long queries
3. Decode base32/base64 encoded data
4. Extract the flag from the traffic

Flag is hidden in DNS TXT record responses.
`);
    }
    
    // Create sample crypto challenge
    if (challengeDir === 'weak-crypto') {
      fs.writeFileSync(path.join(assetsPath, 'rsa_parameters.txt'),
`RSA Cryptography Challenge
===========================

Public Key Parameters:
n = 2519590847565789349402718324004839857142928212620403202777713783604366202070759555626401852588078440691829064124951508218929855914917618450280848912007284499268739632526908884448331394857149259778802761536293362853876040024805361170573315662602023380618981470124817691261054089640913898458311026716082268089

e = 65537

Encrypted Message (c):
c = 1234567890123456789012345678901234567890123456789012345678901234567890

Your Task:
1. Factor the modulus n (hint: check factordb.com)
2. Calculate φ(n) = (p-1)(q-1)
3. Calculate private key: d = e^-1 mod φ(n)
4. Decrypt: m = c^d mod n
5. Convert result to ASCII to get the flag

Tools: Python, factordb.com, OpenSSL
`);
    }

    // Create forensics guide
    if (challengeDir === 'disk-forensics') {
      fs.writeFileSync(path.join(assetsPath, 'forensics_guide.txt'),
`Disk Forensics Investigation Guide
====================================

Challenge: Insider Threat Analysis

Evidence: E01 disk image (simulated)

Key Artifacts to Examine:
1. Windows Registry
   - HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run
   - Look for persistence mechanisms

2. Deleted Files
   - Use Autopsy to recover deleted files
   - Check Documents, Downloads, Desktop

3. Browser History
   - places.sqlite (Firefox)
   - History (Chrome)

4. File System Timeline
   - $MFT analysis
   - USN Journal

Tools Required:
- Autopsy
- FTK Imager
- Registry Explorer

The flag is hidden in a scheduled task registry value.
`);
    }
  }
});
console.log('  ✓ Sample challenge files created');

console.log('\n✅ All fixes applied!\n');
console.log('What was fixed:');
console.log('  ✓ Text selection issue resolved');
console.log('  ✓ Professional About page created');
console.log('  ✓ Sample challenge files added');
console.log('\nRefresh your browser to see the improvements! 🚀\n');
