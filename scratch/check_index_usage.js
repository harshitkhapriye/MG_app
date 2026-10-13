const fs = require('fs');
const index = fs.readFileSync('index.html', 'utf8');

const files = [
  'chain_2.jpg',
  'brclt_7.webp',
  'bngl_17.webp',
  'nkls_12.webp',
  'ring_7.webp',
  'ear_1.webp',
  'photo-1758995115682-1452a1a9e35b'
];

files.forEach(f => {
  console.log(`${f}: in index.html?`, index.includes(f));
});
