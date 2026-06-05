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

## Repository Structure

```text
app/            Next.js application
components/     UI components
content/        MDX challenge files
lib/            Core application logic
public/         Static assets
scripts/        Utility and build scripts
```

## Research Paper

This repository accompanies the paper:

"UNG CTF Platform: Operation North Guard: A Multi-Variant Dynamic Flag Framework for Cybersecurity Education"

## Authors

Kian Esmaeili
University of North Georgia

## License

MIT License
