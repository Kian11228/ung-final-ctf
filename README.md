# Operation North Guard

Operation North Guard is a Capture-the-Flag (CTF) platform developed for the CYBR 4950 Cybersecurity Capstone course at the University of North Georgia (UNG).

The platform was designed to improve cybersecurity education through hands-on learning while addressing academic integrity concerns commonly associated with traditional CTF environments. The system implements a dynamic multi-variant flag validation model that assigns unique valid flag variants to students, reducing opportunities for flag sharing and plagiarism.

## Features

* Dynamic multi-variant flag validation
* MDX-based challenge engine
* Progressive hint system
* Student progress tracking
* Responsive modern user interface
* Static deployment through GitHub Pages
* GitHub Actions CI/CD pipeline

## Technologies

* Next.js 14
* React 18
* TypeScript
* Tailwind CSS
* Zustand
* MDX
* GitHub Actions

## Challenge Areas

The platform currently includes challenges covering:

* Network Forensics
* Disk Forensics
* Cryptography
* Reverse Engineering
* Web Security
* Cloud Security
* Privilege Escalation
* Governance, Risk, and Compliance (GRC)

## Research Contribution

Operation North Guard introduces a dynamic multi-variant flag framework designed specifically for academic Capture-the-Flag environments. The approach seeks to improve assessment integrity while preserving the educational benefits of hands-on cybersecurity exercises.

## Running Locally

```bash
npm install
npm run dev      # http://localhost:3000/ung-final-ctf
npm run build    # static export to out/, deployed to GitHub Pages by GitHub Actions
npm test         # flag validation tests
```

## Multi-Variant Flags

Each challenge's frontmatter lists several flag variants. Only a salted SHA-256 hash of each variant is published:

```yaml
flag:
  format: "ung{.*}"
  salt: "ung_salt_network-breach_2025"
  variants:
    - id: "variant-a"
      sha256: "..."
    - id: "variant-b"
      sha256: "..."
```

Students enter their student ID once. Each student is deterministically assigned one variant per challenge (`lib/flag.ts`), receives that variant's files, and only that variant's flag is accepted for them. A flag shared by a student assigned a different variant is rejected.

### Generating flags (instructors)

```bash
npm run flags:generate                  # create variants for challenges that have none
npm run flags:generate -- --force       # replace all flags (e.g. for a new semester)
npm run flags:generate -- --variants 6  # pool size for newly generated challenges
```

This writes the hashes into each `index.mdx` and the plaintext flags to `flags.local.json`, the instructor answer key. That file is git-ignored: keep it private and never commit it.

### Challenge files

- `content/challenges/<slug>/assets/` files are given to every student.
- `content/challenges/<slug>/assets/variants/<variant-id>/` files are given only to students assigned that variant. The flag hidden in them must be that variant's flag from `flags.local.json`.

### Limitations

- The platform is a static site with no login, so the student ID is self-reported and progress is stored in the browser. A student could enter another student's ID; collecting IDs through an authenticated system would close this gap.
- Students who are assigned the same variant share the same flag. Larger variant pools reduce this.

## Repository Structure

```text
app/            Next.js application
components/     UI components
content/        MDX challenge files
lib/            Core application logic (flag validation in lib/flag.ts)
public/         Static assets
scripts/        Flag generation and build scripts
```

## Research Paper

This repository accompanies the paper:

"UNG CTF Platform: Operation North Guard: A Multi-Variant Dynamic Flag Framework for Cybersecurity Education"

## Authors

Kian Esmaeili
University of North Georgia

## License

MIT License
