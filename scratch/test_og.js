const https = require('https');

const pages = [
  'https://unsplash.com/photos/mature-goldsmith-making-a-ring-ow8QIFDW9yo',
  'https://unsplash.com/photos/a-jeweler-uses-a-torch-to-solder-a-ring-RQRGW-lSLWk',
  'https://unsplash.com/photos/artisan-uses-torch-on-rough-material-for-jewelry-making-0NLHuBUFCTQ',
  'https://unsplash.com/photos/an-elderly-man-works-with-a-hammer-and-tool-v44FEP6V41M'
];

pages.forEach((page, i) => {
  https.get(page, { 
    headers: { 'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)' } 
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`Page ${i}: status ${res.statusCode}`);
      const m = data.match(/property="og:image" content="([^"]+)"/);
      if (m) {
        console.log(`  og:image: ${m[1]}`);
      }
    });
  }).on('error', err => console.log('Err:', err.message));
});
