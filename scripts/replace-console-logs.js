#!/usr/bin/env node

/**
 * Script to help replace console.log with logger
 * Run: node scripts/replace-console-logs.js
 * 
 * This will show you all console.log statements that should be replaced
 * Manual replacement recommended for safety
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = path.join(__dirname, '../src');

function findConsoleLogs(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !filePath.includes('node_modules')) {
      findConsoleLogs(filePath, fileList);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const consoleMatches = content.match(/console\.(log|error|warn|info|debug)/g);
      
      if (consoleMatches) {
        fileList.push({
          file: filePath.replace(srcDir + '/', ''),
          count: consoleMatches.length,
          matches: consoleMatches
        });
      }
    }
  });

  return fileList;
}

const results = findConsoleLogs(srcDir);

console.log('\n📊 Console Statement Analysis:\n');
console.log(`Total files with console statements: ${results.length}`);
console.log(`Total console statements: ${results.reduce((sum, r) => sum + r.count, 0)}\n`);

results.forEach(result => {
  console.log(`  ${result.file}: ${result.count} statements`);
});

console.log('\n💡 Recommendation:');
console.log('  1. Import logger: import logger from "../utils/logger";');
console.log('  2. Replace console.log with logger.log');
console.log('  3. Replace console.error with logger.error');
console.log('  4. Replace console.warn with logger.warn');
console.log('\n⚠️  Note: Some console.error statements should remain for critical errors\n');

