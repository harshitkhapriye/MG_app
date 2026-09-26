const fs = require('fs');
const path = require('path');

const batch1 = [
  'shop.html',
  'cart.html',
  'wishlist.html',
  'checkout.html',
  'login.html',
  'register.html',
  'profile.html',
  'scheme.html'
];

const scriptBlock = `    <!-- Multi-Vendor Theming Engine -->
    <script src="assets/ecomm/js/vendor-config.js"></script>
    <script src="assets/ecomm/js/theme-injector.js"></script>
</head>`;

let modifiedFiles = [];

for (const rel of batch1) {
  const filePath = path.join(__dirname, '..', rel);
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('assets/ecomm/js/vendor-config.js')) {
    console.log(rel + ' already has vendor-config.js, skipping.');
    continue;
  }

  const isCrlf = content.includes('\r\n');
  const eol = isCrlf ? '\r\n' : '\n';
  const targetScriptBlock = scriptBlock.replace(/\n/g, eol);

  // Replace the closing </head>
  if (!content.includes('</head>')) {
    console.error('No </head> tag found in ' + rel);
    continue;
  }

  // Replace only the first occurrence of </head>
  content = content.replace('</head>', targetScriptBlock);

  fs.writeFileSync(filePath, content, 'utf8');
  modifiedFiles.push(rel);
  console.log('Successfully updated ' + rel);
}

console.log('Batch 1 complete. Modified files count:', modifiedFiles.length);
