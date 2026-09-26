const https = require('https');

function search(q) {
  return new Promise((resolve) => {
    https.get('https://html.duckduckgo.com/html/?q=' + encodeURIComponent(q), { 
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } 
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const matches = [...data.matchAll(/uddg=([^&"']+)/g)].map(m => decodeURIComponent(m[1]));
        const photoLinks = matches.filter(u => u.includes('unsplash.com/photos/'));
        resolve(photoLinks);
      });
    }).on('error', () => resolve([]));
  });
}

async function run() {
  const queries = [
    { name: 'bridal', q: 'site:unsplash.com/photos "indian bridal" OR "bridal jewelry"' },
    { name: 'festive', q: 'site:unsplash.com/photos "gold necklace" "earrings"' },
    { name: 'antique', q: 'site:unsplash.com/photos "antique jewelry" OR "temple jewelry"' },
    { name: 'minimal', q: 'site:unsplash.com/photos "gold rings" "everyday"' },
    { name: 'mens', q: 'site:unsplash.com/photos "men" "gold chain" OR "signet"' }
  ];

  for (const item of queries) {
    const links = await search(item.q);
    console.log(`=== ${item.name} (${links.length} found) ===`);
    links.slice(0, 5).forEach(l => console.log('  ' + l));
  }
}

run();
