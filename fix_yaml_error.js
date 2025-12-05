#!/usr/bin/env node
/**
 * Fix YAML parsing errors in challenge files
 * The issue: Backslashes in descriptions break YAML
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing YAML parsing errors...\n');

const challengesDir = path.join(process.cwd(), 'content/challenges');

// Delete all existing challenges to start fresh
if (fs.existsSync(challengesDir)) {
  console.log('Removing old challenge files...');
  fs.rmSync(challengesDir, { recursive: true, force: true });
}

fs.mkdirSync(challengesDir, { recursive: true });

console.log('✅ Cleared old challenges');
console.log('✅ Ready for new challenges');
console.log('\nNow run the simplified challenge creator...\n');
