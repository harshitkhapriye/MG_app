

const fs = require('fs');
const path = require('path');

const targetFiles = [
  'assets/ecomm/css/theme-style.css',
  'assets/ecomm/css/style2.css',
  'ecom/each_css/shop-style.css',
  'ecom/each_css/wishlist-style.css',
  'ecom/each_css/legacy-page-style.css',
  'ecom/each_css/register-style.css',
  'ecom/each_css/login-style.css',
  'ecom/each_css/product-detail-style.css',
  'ecom/each_css/about-style.css',
  'ecom/each_css/catalogue-style.css',
  'ecom/each_css/contact-style.css',
  'ecom/each_css/checkout-style.css',
  'ecom/each_css/catalogue-gallery-style.css',
  'ecom/each_css/scheme-details-style.css',
  'ecom/each_css/teaser-style.css'
];

function isGoldHue(str) {
  str = str.trim().toLowerCase();

  const goldHexes = [
    '#d4af37', '#a8802a', '#f2dd9a', '#b8912b', '#c7a32f',
    '#d9b566', '#d8b26e', '#c59b27', '#e2c275', '#dfb75c',
    '#e5c158', '#f0d38d', '#cf9b27', '#daa520', '#ffd700',
    '#b38a2e', '#9b741f', '#e6c875', '#caa23d', '#be942e',
    '#dab353', '#e4bd5a', '#bb8e28', '#c99e32', '#aa7e1d',
    '#c8963e', '#e9c35d', '#ecd078', '#f5e2a3', '#eed994',
    '#d2a632', '#f6e7b8', '#d09f2d', '#b08726', '#e0be68',
    '#cd9f35', '#c89d2d', '#ab8124', '#f1d688', '#dda73a',
    '#bd9228', '#e3bf64', '#c3952a'
  ];
  for (const h of goldHexes) {
    if (str.includes(h)) return true;
  }

  // Hex regex to test RGB hue
  const hexMatch = str.match(/#([0-9a-f]{6}|[0-9a-f]{3})\b/i);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    if (r > 130 && g > 90 && r >= g && g > b && b < 170) {
      if ((r - b) > 35 && (g - b) > 15) {
        return true;
      }
    }
  }

  // Check rgb/rgba
  const rgbMatch = str.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d\.]+))?\s*\)/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    if (r > 130 && g > 90 && r >= g && g > b && b < 170) {
      if ((r - b) > 35 && (g - b) > 15) {
        return true;
      }
    }
  }

  return false;
}

const audit = JSON.parse(fs.readFileSync(path.join(__dirname, 'detailed_audit.json'), 'utf8'));

let results = [];
let fileCounts = {};

for (const [file, items] of Object.entries(audit)) {
  if (!targetFiles.includes(file)) continue;
  for (const item of items) {
    if (isGoldHue(item.color)) {
      results.push(item);
      fileCounts[file] = (fileCounts[file] || 0) + 1;
    }
  }
}

console.log('Total gold brand color occurrences found:', results.length);
console.log('Breakdown by file:');
for (const [f, c] of Object.entries(fileCounts)) {
  console.log('  ' + f + ': ' + c);
}

fs.writeFileSync(path.join(__dirname, 'gold_audit.json'), JSON.stringify(results, null, 2));
