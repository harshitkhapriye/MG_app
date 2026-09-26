const fs = require('fs');
const path = require('path');

const partials = ['header.html', 'footer.html'];
const alreadyDone = [
  'cart.html', 'checkout.html', 'index.html', 'login.html',
  'profile.html', 'register.html', 'scheme.html', 'shop.html', 'wishlist.html'
];

const batch2 = fs.readdirSync(path.join(__dirname, '..'))
  .filter(f => f.endsWith('.html') && !partials.includes(f) && !alreadyDone.includes(f));

const scriptBlock = `    <!-- Multi-Vendor Theming Engine -->
    <script src="assets/ecomm/js/vendor-config.js"></script>
    <script src="assets/ecomm/js/theme-injector.js"></script>
</head>`;

let successCount = 0;
let updatedFiles = [];

for (const rel of batch2) {
  const filePath = path.join(__dirname, '..', rel);
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('assets/ecomm/js/vendor-config.js')) {
    console.log(rel + ' already contains vendor scripts, skipping.');
    continue;
  }

  if (!content.includes('</head>')) {
    console.error('ERROR: No </head> tag in ' + rel);
    continue;
  }

  const isCrlf = content.includes('\r\n');
  const eol = isCrlf ? '\r\n' : '\n';
  const targetScriptBlock = scriptBlock.replace(/\n/g, eol);

  content = content.replace('</head>', targetScriptBlock);
  fs.writeFileSync(filePath, content, 'utf8');
  updatedFiles.push(rel);
  successCount++;
}

console.log('Batch 2 processing complete.');
console.log('Successfully updated:', successCount, 'out of', batch2.length, 'files.');
fs.writeFileSync(path.join(__dirname, 'batch2_updated_files.json'), JSON.stringify(updatedFiles, null, 2));
