const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const files = [
  'assets/ecomm/css/theme-style.css',
  'ecom/each_css/shop-style.css',
  'ecom/each_css/legacy-page-style.css',
  'ecom/each_css/wishlist-style.css',
  'ecom/each_css/product-detail-style.css',
  'ecom/each_css/register-style.css',
  'ecom/each_css/catalogue-style.css',
  'ecom/each_css/login-style.css',
  'ecom/each_css/about-style.css',
  'ecom/each_css/checkout-style.css',
  'ecom/each_css/contact-style.css',
  'ecom/each_css/scheme-details-style.css',
  'ecom/each_css/catalogue-gallery-style.css',
  'ecom/each_css/teaser-style.css'
];

let allMatches = [];

files.forEach(rel => {
  const filePath = path.join(rootDir, rel);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);

  let mediaStack = [];
  let currentSelector = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check for @media start
    const mediaMatch = trimmed.match(/^@media\s*([^{]+)\{/);
    if (mediaMatch) {
      mediaStack.push({ query: mediaMatch[1].trim(), depth: 1 });
      continue;
    }

    // Check brace tracking in media query
    if (mediaStack.length > 0) {
      for (const char of line) {
        if (char === '{') {
          mediaStack[mediaStack.length - 1].depth++;
        } else if (char === '}') {
          mediaStack[mediaStack.length - 1].depth--;
          if (mediaStack[mediaStack.length - 1].depth <= 0) {
            mediaStack.pop();
          }
        }
      }
    }

    if (trimmed.includes('{') && !trimmed.startsWith('@')) {
      currentSelector = trimmed.split('{')[0].trim();
    }

    if (line.includes('var(--mg-gold')) {
      const activeMedia = mediaStack.length > 0 ? mediaStack[mediaStack.length - 1].query : null;
      allMatches.push({
        file: rel,
        lineNo: i + 1,
        code: trimmed,
        selector: currentSelector,
        media: activeMedia
      });
    }
  }
});

console.log('Total variable usages found across files:', allMatches.length);
const mobileScoped = allMatches.filter(m => m.media && m.media.includes('max-width'));
const desktopScoped = allMatches.filter(m => m.media && m.media.includes('min-width'));
const globalScoped = allMatches.filter(m => !m.media);

console.log('Global/unscoped:', globalScoped.length);
console.log('Mobile-scoped (max-width):', mobileScoped.length);
console.log('Desktop-scoped (min-width):', desktopScoped.length);

console.log('\n--- MOBILE SCOPED BREAKDOWN BY FILE ---');
const byFile = {};
mobileScoped.forEach(m => {
  byFile[m.file] = (byFile[m.file] || 0) + 1;
});
console.log(JSON.stringify(byFile, null, 2));

console.log('\n--- LIST OF ALL MOBILE-SCOPED CONVERSIONS ---');
mobileScoped.forEach((m, idx) => {
  console.log(`${idx + 1}. [${m.file}:${m.lineNo}] Media: ${m.media} | Selector: ${m.selector} | Property: ${m.code}`);
});

fs.writeFileSync(path.join(__dirname, 'mobile_scoped_conversions.json'), JSON.stringify(mobileScoped, null, 2));
