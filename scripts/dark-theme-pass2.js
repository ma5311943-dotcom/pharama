const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/Muhammad Ilyas/Desktop/7 pharmacy/src';

const replacements = [
  { regex: /\bborder-white\/80\b/g, replacement: 'border-border-nav/80' },
  { regex: /\bborder-white\/60\b/g, replacement: 'border-border-nav/60' },
  { regex: /\bborder-white\/50\b/g, replacement: 'border-border-nav/50' },
  { regex: /\bborder-white\/40\b/g, replacement: 'border-border-nav/40' },
  { regex: /\bborder-white\/20\b/g, replacement: 'border-border-nav/20' },
  { regex: /\bborder-white\/10\b/g, replacement: 'border-border-nav/10' },
  { regex: /\bborder-white\/5\b/g, replacement: 'border-border-nav/5' },
  { regex: /\bborder-white\b/g, replacement: 'border-border-nav' },
  { regex: /\bvia-white\/30\b/g, replacement: 'via-bg-page/30' },
  { regex: /\bvia-white\b/g, replacement: 'via-bg-page' },
  { regex: /\bring-white\b/g, replacement: 'ring-border-nav' },
  { regex: /\bfrom-white\b/g, replacement: 'from-bg-page' },
  { regex: /\bto-white\b/g, replacement: 'to-bg-page' },
  { regex: /\bbg-\[#1B2A3B\]\b/g, replacement: 'bg-bg-card' },
  { regex: /\bbg-\[#0b0f19\]\b/g, replacement: 'bg-bg-page' }
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
