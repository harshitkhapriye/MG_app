const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'assets', 'ecomm', 'css', 'theme-style.css');
let css = fs.readFileSync(filePath, 'utf8');

// 1. Update :root
const oldRoot = `  --mg-gold-1: #a8802a;
  --mg-gold-2: #d4af37;
  --mg-gold-3: #f2dd9a;
  --mg-gold-4: #b8912b;`;

const newRoot = `  --mg-gold-1: #a8802a;
  --mg-gold-1-rgb: 168, 128, 42;
  --mg-gold-2: #d4af37;
  --mg-gold-2-rgb: 212, 175, 55;
  --mg-gold-3: #f2dd9a;
  --mg-gold-3-rgb: 242, 221, 154;
  --mg-gold-4: #b8912b;
  --mg-gold-4-rgb: 184, 145, 43;
  --mg-gold-champagne: #d9b566;
  --mg-gold-champagne-rgb: 217, 181, 102;`;

if (!css.includes(oldRoot)) {
  console.error(':root pattern not found!');
  process.exit(1);
}
css = css.replace(oldRoot, newRoot);

// 2. Specific solid replacements
const exactReplacements = [
  {
    target: 'color: #b59733;',
    replace: 'color: var(--mg-gold-4);'
  },
  {
    target: 'color: #d4af37;',
    replace: 'color: var(--mg-gold-2);'
  },
  {
    target: 'color: #d4af37 !important;',
    replace: 'color: var(--mg-gold-2) !important;'
  },
  {
    target: 'background: linear-gradient(160deg, #e7c254 0%, #f5f1eb 100%);',
    replace: 'background: linear-gradient(160deg, var(--mg-gold-champagne) 0%, #f5f1eb 100%);'
  },
  {
    target: 'background: #c7a32f;',
    replace: 'background: var(--mg-gold-4);'
  },
  {
    target: 'background: linear-gradient(160deg, #e7c254 0%, #e5dac4 100%);',
    replace: 'background: linear-gradient(160deg, var(--mg-gold-champagne) 0%, #e5dac4 100%);'
  }
];

for (const r of exactReplacements) {
  if (!css.includes(r.target)) {
    console.error('Target not found:', r.target);
    process.exit(1);
  }
  css = css.replace(r.target, r.replace);
}

// 3. RGBA replacements
// 212, 175, 55 -> var(--mg-gold-2-rgb)
css = css.replace(/rgba\(\s*212\s*,\s*175\s*,\s*55\s*,\s*([\d\.]+)\s*\)/g, 'rgba(var(--mg-gold-2-rgb), $1)');

// 217, 181, 102 -> var(--mg-gold-champagne-rgb)
css = css.replace(/rgba\(\s*217\s*,\s*181\s*,\s*102\s*,\s*([\d\.]+)\s*\)/g, 'rgba(var(--mg-gold-champagne-rgb), $1)');

// 168, 128, 42 -> var(--mg-gold-1-rgb)
css = css.replace(/rgba\(\s*168\s*,\s*128\s*,\s*42\s*,\s*([\d\.]+)\s*\)/g, 'rgba(var(--mg-gold-1-rgb), $1)');

// 242, 221, 154 -> var(--mg-gold-3-rgb)
css = css.replace(/rgba\(\s*242\s*,\s*221\s*,\s*154\s*,\s*([\d\.]+)\s*\)/g, 'rgba(var(--mg-gold-3-rgb), $1)');

fs.writeFileSync(filePath, css, 'utf8');
console.log('Successfully updated theme-style.css with CSS variables.');
