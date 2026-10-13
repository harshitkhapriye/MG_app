const { execSync } = require('child_process');
const fs = require('fs');

try {
  const html = execSync('curl.exe -s -L "https://unsplash.com/s/photos/mens-jewelry" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"', { maxBuffer: 10 * 1024 * 1024 }).toString();
  console.log('HTML length:', html.length);
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/);
  if (match) {
    const data = JSON.parse(match[1]);
    console.log('Found __NEXT_DATA__!');
    const queries = data.props?.pageProps?.initialState?.entities?.photos || {};
    console.log('Photos count:', Object.keys(queries).length);
    Object.values(queries).slice(0, 10).forEach(p => {
      console.log(p.id, p.description || p.alt_description, p.urls?.small);
    });
  } else {
    console.log('No __NEXT_DATA__ found');
    // Look for any photo URLs
    const m = [...html.matchAll(/https:\/\/images\.unsplash\.com\/([a-zA-Z0-9_-]+)/g)];
    console.log('Image URLs:', [...new Set(m.map(x => x[0]))].slice(0, 10));
  }
} catch (e) {
  console.error('Error:', e.message);
}
