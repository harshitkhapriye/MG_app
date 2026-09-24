const fs = require('fs');
const path = require('path');

const targetFiles = [
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

let summary = {};

for (const rel of targetFiles) {
  const filePath = path.join(__dirname, '..', rel);
  let content = fs.readFileSync(filePath, 'utf8');

  // Detect CRLF
  const isCrlf = content.includes('\r\n');
  const eol = isCrlf ? '\r\n' : '\n';

  let initialCount = 0;
  const countMatches = (regex) => (content.match(regex) || []).length;

  initialCount += countMatches(/rgba\(\s*212\s*,\s*175\s*,\s*55\s*,/g);
  initialCount += countMatches(/rgba\(\s*217\s*,\s*181\s*,\s*102\s*,/g);
  initialCount += countMatches(/rgba\(\s*242\s*,\s*221\s*,\s*154\s*,/g);
  initialCount += countMatches(/rgba\(\s*197\s*,\s*160\s*,\s*89\s*,/g);
  initialCount += countMatches(/rgba\(\s*226\s*,\s*201\s*,\s*138\s*,/g);

  // Standard RGBA replacements
  content = content.replace(/rgba\(\s*212\s*,\s*175\s*,\s*55\s*,\s*([\d\.]+)\s*\)/g, 'rgba(var(--mg-gold-2-rgb), $1)');
  content = content.replace(/rgba\(\s*217\s*,\s*181\s*,\s*102\s*,\s*([\d\.]+)\s*\)/g, 'rgba(var(--mg-gold-champagne-rgb), $1)');
  content = content.replace(/rgba\(\s*242\s*,\s*221\s*,\s*154\s*,\s*([\d\.]+)\s*\)/g, 'rgba(var(--mg-gold-3-rgb), $1)');

  // Legacy page antique gold replacements
  if (rel.includes('legacy-page-style.css')) {
    content = content.replace(/rgba\(\s*197\s*,\s*160\s*,\s*89\s*,\s*([\d\.]+)\s*\)/g, 'rgba(var(--mg-gold-champagne-rgb), $1)');
    content = content.replace(/rgba\(\s*226\s*,\s*201\s*,\s*138\s*,\s*([\d\.]+)\s*\)/g, 'rgba(var(--mg-gold-3-rgb), $1)');
  }

  // Ensure consistent line endings
  if (isCrlf) {
    content = content.replace(/\r?\n/g, '\r\n');
  } else {
    content = content.replace(/\r\n/g, '\n');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  summary[rel] = initialCount;
  console.log('Processed ' + rel + ': ' + initialCount + ' replacements.');
}

console.log('All 13 files updated successfully.');
fs.writeFileSync(path.join(__dirname, 'each_css_conversion_summary.json'), JSON.stringify(summary, null, 2));
