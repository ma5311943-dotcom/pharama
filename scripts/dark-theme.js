const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/Muhammad Ilyas/Desktop/7 pharmacy/src';

const replacements = [
  { regex: /\bbg-white\b/g, replacement: 'bg-bg-card' },
  { regex: /\bbg-gray-50\b/g, replacement: 'bg-bg-page' },
  { regex: /\bbg-gray-100\b/g, replacement: 'bg-bg-page' },
  { regex: /\btext-black\b/g, replacement: 'text-text-heading' },
  { regex: /\btext-gray-900\b/g, replacement: 'text-text-heading' },
  { regex: /\btext-gray-800\b/g, replacement: 'text-text-body' },
  { regex: /\btext-gray-700\b/g, replacement: 'text-text-muted' },
  { regex: /\btext-gray-600\b/g, replacement: 'text-text-muted' },
  { regex: /\bborder-gray-100\b/g, replacement: 'border-border-nav' },
  { regex: /\bborder-gray-200\b/g, replacement: 'border-border-nav' },
  { regex: /\bborder-gray-300\b/g, replacement: 'border-border-nav' },
  { regex: /\bbg-white\/10\b/g, replacement: 'bg-bg-card/10' },
  { regex: /\bbg-white\/20\b/g, replacement: 'bg-bg-card/20' },
  { regex: /\bbg-white\/40\b/g, replacement: 'bg-bg-card/40' },
  { regex: /\bbg-white\/60\b/g, replacement: 'bg-bg-card/60' },
  { regex: /\bbg-white\/90\b/g, replacement: 'bg-bg-card/90' },
  { regex: /\bbg-white\/95\b/g, replacement: 'bg-bg-card/95' },
];

function processDir(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      replacements.forEach(({ regex, replacement }) => {
        content = content.replace(regex, replacement);
      });
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated: ' + fullPath);
      }
    }
  }
}

processDir(dir);
