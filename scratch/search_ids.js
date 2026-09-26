const https = require('https');

const q = '"images.unsplash.com/photo-" jewelry gold';
https.get('https://html.duckduckgo.com/html/?q=' + encodeURIComponent(q), {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
}, res => {
  let html = '';
  res.on('data', c => html += c);
  res.on('end', () => {
    const ids = [...html.matchAll(/photo-([0-9a-zA-Z-]+)/g)].map(m => 'photo-' + m[1].split('?')[0]);
    console.log('Unique IDs:', [...new Set(ids)].slice(0, 20));
  });
});
