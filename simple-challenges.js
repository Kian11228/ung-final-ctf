#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🎓 Creating 8 CTF Challenges (Fixed Version)...\n');

const challenges = [
  {
    id: 'network-breach',
    title: 'Corporate Network Breach Investigation',
    category: 'forensics',
    difficulty: 'easy',
    points: 150,
    tags: ['wireshark', 'pcap', 'dns'],
    flag: 'ung{dns_exfiltration_c2_detected}',
  },
  {
    id: 'weak-crypto',
    title: 'Weak RSA Implementation',
    category: 'crypto',
    difficulty: 'medium',
    points: 250,
    tags: ['rsa', 'cryptography', 'factorization'],
    flag: 'ung{weak_primes_factored_successfully}',
  },
  {
    id: 'disk-forensics',
    title: 'Insider Threat Disk Analysis',
    category: 'forensics',
    difficulty: 'medium',
    points: 275,
    tags: ['forensics', 'windows', 'registry'],
    flag: 'ung{registry_persistence_found}',
  },
  {
    id: 'web-sqli',
    title: 'Healthcare Portal SQL Injection',
    category: 'web',
    difficulty: 'medium',
    points: 200,
    tags: ['sql-injection', 'web-security', 'owasp'],
    flag: 'ung{sql_injection_bypass_complete}',
  },
  {
    id: 'malware-analysis',
    title: 'APT Malware Reverse Engineering',
    category: 'reversing',
    difficulty: 'hard',
    points: 400,
    tags: ['malware', 'reverse-engineering', 'c2'],
    flag: 'ung{c2_domain_xor_key_extracted}',
  },
  {
    id: 'cloud-s3',
    title: 'AWS S3 Misconfiguration Audit',
    category: 'web',
    difficulty: 'medium',
    points: 225,
    tags: ['aws', 's3', 'cloud-security'],
    flag: 'ung{s3_public_bucket_exposed}',
  },
  {
    id: 'linux-privesc',
    title: 'Linux Privilege Escalation',
    category: 'misc',
    difficulty: 'hard',
    points: 450,
    tags: ['linux', 'privilege-escalation', 'suid'],
    flag: 'ung{root_access_suid_exploit}',
  },
  {
    id: 'grc-compliance',
    title: 'NIST Cybersecurity Framework Assessment',
    category: 'misc',
    difficulty: 'medium',
    points: 300,
    tags: ['grc', 'nist', 'compliance'],
    flag: 'ung{nist_csf_identify_protect_detect_respond_recover}',
  }
];

const baseDir = path.join(process.cwd(), 'content/challenges');

challenges.forEach((c, i) => {
  console.log(`Creating ${i+1}/8: ${c.title}...`);
  
  const dir = path.join(baseDir, c.id);
  const assets = path.join(dir, 'assets');
  
  fs.mkdirSync(dir, { recursive: true });
  fs.mkdirSync(assets, { recursive: true });
  
  const salt = `ung_salt_${c.id}_2025`;
  const hash = crypto.createHash('sha256').update(salt + c.flag).digest('hex');
  
  // Create MDX with proper YAML escaping
  const mdx = `---
id: ${c.id}
title: "${c.title}"
category: "${c.category}"
difficulty: "${c.difficulty}"
points: ${c.points}
tags: ${JSON.stringify(c.tags)}
author: "UNG Cybersecurity Faculty"
createdAt: "2025-01-15"
updatedAt: "2025-01-15"
flag:
  format: "ung{.*}"
  salt: "${salt}"
  sha256: "${hash}"
hints:
  - "Start by examining the basic artifacts and evidence provided"
  - "Use industry-standard tools for this type of analysis"
  - "The flag follows the format ung{...} with descriptive text"
writeupVisibility: "after-solve"
---

## Challenge Overview

${getDescription(c.id)}

## Learning Objectives

- Apply ${c.category} analysis techniques
- Use professional security tools
- Understand real-world attack scenarios
- Document findings professionally

## Tools You May Need

${getTools(c.id)}

## Getting Started

1. Review the challenge description carefully
2. Gather and examine all provided materials
3. Apply systematic analysis methodology
4. Document your findings as you progress
5. Submit the flag when discovered

## Flag Format

All flags follow the format: \`ung{descriptive_text}\`

Good luck!
`;

  fs.writeFileSync(path.join(dir, 'index.mdx'), mdx);
  
  // Create placeholder README in assets
  fs.writeFileSync(
    path.join(assets, 'README.txt'),
    'Challenge files would be placed here.\nFor this demo, files are referenced but not included.'
  );
});

function getDescription(id) {
  const descriptions = {
    'network-breach': 'Analyze captured network traffic from a corporate breach. DNS exfiltration was used to steal data. Your mission is to identify the command and control communication patterns and extract the flag from the network artifacts.',
    'weak-crypto': 'A certificate authority was compromised using weak RSA keys. The attacker used small prime numbers making factorization possible. Factor the provided public key to decrypt the message and recover the flag.',
    'disk-forensics': 'Investigate a seized laptop from a suspected insider threat. Perform disk forensics to recover deleted files, analyze Windows Registry for persistence mechanisms, and extract evidence of data theft.',
    'web-sqli': 'Conduct a security assessment of a healthcare web portal. The login system is vulnerable to SQL injection. Bypass authentication, escalate to admin privileges, and retrieve the flag from the database.',
    'malware-analysis': 'Reverse engineer a custom APT malware sample. The binary uses XOR encryption to hide its command and control configuration. Perform static and dynamic analysis to extract the C2 domain and flag.',
    'cloud-s3': 'Audit AWS cloud infrastructure for security issues. A misconfigured S3 bucket is publicly accessible. Enumerate the bucket, download sensitive files, and extract the flag from exposed credentials.',
    'linux-privesc': 'You have low-privilege SSH access to a Linux server. Identify privilege escalation vectors such as SUID binaries, sudo misconfigurations, or exploitable services to gain root access and capture the flag.',
    'grc-compliance': 'Perform a governance, risk, and compliance assessment using the NIST Cybersecurity Framework. Map the previous challenge findings to NIST CSF controls and create an executive summary. The flag is the five core functions in order.'
  };
  return descriptions[id] || 'Complete this challenge to earn points.';
}

function getTools(id) {
  const tools = {
    'network-breach': '- Wireshark or tshark for packet analysis\n- CyberChef for decoding\n- Network protocol references',
    'weak-crypto': '- Python with sympy or gmpy2\n- factordb.com for factorization\n- OpenSSL for key operations',
    'disk-forensics': '- Autopsy or FTK Imager\n- Registry Explorer\n- Windows forensics toolkit',
    'web-sqli': '- Burp Suite or OWASP ZAP\n- sqlmap for automated testing\n- Browser developer tools',
    'malware-analysis': '- Ghidra or IDA for disassembly\n- x64dbg for debugging\n- Strings and hex editors',
    'cloud-s3': '- AWS CLI\n- S3Scanner\n- curl or wget for downloads',
    'linux-privesc': '- LinPEAS enumeration script\n- GTFOBins reference\n- SSH access to target',
    'grc-compliance': '- NIST CSF documentation\n- Risk assessment templates\n- Microsoft Word or Excel'
  };
  return tools[id] || '- Standard security toolkit\n- Documentation and references';
}

console.log('\n✅ All 8 challenges created!\n');
console.log('📊 Summary:');
challenges.forEach(c => {
  console.log(`  ✓ ${c.title} (${c.difficulty} - ${c.points} pts)`);
});
console.log('\n🎯 Total Points: 2,250');
console.log('\nRefresh your browser to see the challenges! 🚀\n');
