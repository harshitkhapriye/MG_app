const https = require('https');

function searchDDG(query) {
  return new Promise((resolve) => {
    const url = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(query);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const matches = [...data.matchAll(/uddg=([^&"]+)/g)].map(m => decodeURIComponent(m[1]));
        const photoLinks = matches.filter(u => u.includes('unsplash.com/photos/'));
        resolve(photoLinks);
      });
    }).on('error', () => resolve([]));
  });
}

async function run() {
  const queries = [
    'site:unsplash.com/photos gold jewelry luxury',
    'site:unsplash.com/photos silver rings jewelry',
    'site:unsplash.com/photos kundan bridal jewelry indian',
    'site:unsplash.com/photos gemstone ruby emerald jewelry',
    'site:unsplash.com/photos goldsmith workshop tools workbench',
    'site:unsplash.com/photos jeweler artisan making ring crafting',
    'site:unsplash.com/photos gold bullion hallmark bars gold inspection',
    'site:unsplash.com/photos indian bride royal wedding jewelry gold',
    'site:unsplash.com/photos bridal jewelry luxury banner wedding',
    'site:unsplash.com/photos luxury gold jewelry collection banner'
  ];

  for (const q of queries) {
    const links = await searchDDG(q);
    console.log(`Query: ${q}`);
    console.log(`Found ${links.length} links:`);
    links.slice(0, 3).forEach(l => console.log('  ' + l));
    console.log('');
  }
}

run();
