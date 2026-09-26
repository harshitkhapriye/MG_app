const https = require('https');
const fs = require('fs');

function search(q) {
  return new Promise((resolve) => {
    https.get('https://html.duckduckgo.com/html/?q=' + encodeURIComponent(q), { 
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } 
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const matches = [...data.matchAll(/uddg=([^&"']+)/g)].map(m => decodeURIComponent(m[1]));
        const links = matches.filter(u => u.includes('unsplash.com/photos/'));
        resolve(links);
      });
    }).on('error', () => resolve([]));
  });
}

async function run() {
  const queries = [
    { key: 'silver', q: 'site:unsplash.com/photos "sterling silver" ring OR bracelet OR necklace' },
    { key: 'silver2', q: 'site:unsplash.com/photos "silver jewelry" rings' },
    { key: 'workshop', q: 'site:unsplash.com/photos goldsmith bench OR jewelry workshop' },
    { key: 'bullion', q: 'site:unsplash.com/photos "gold bullion" OR "gold bars"' },
    { key: 'bridal', q: 'site:unsplash.com/photos "indian bride" jewelry wedding' }
  ];

  const results = {};
  for (const item of queries) {
    results[item.key] = await search(item.q);
    console.log(`${item.key}: found ${results[item.key].length} links`);
    results[item.key].slice(0, 4).forEach(l => console.log('  ' + l));
  }
}

run();
