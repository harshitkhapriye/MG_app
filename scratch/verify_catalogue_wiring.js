const http = require('http');
const fs = require('fs');

const fileContent = fs.readFileSync('cateloge.html', 'utf8');

const images = [
  'assets/ecomm/images/catalogue/catalogue_bridal_heritage.jpg',
  'assets/ecomm/images/catalogue/catalogue_festive_gold.jpg',
  'assets/ecomm/images/catalogue/catalogue_temple_antique.jpg',
  'assets/ecomm/images/catalogue/catalogue_everyday_minimal.jpg',
  'assets/ecomm/images/catalogue/catalogue_mens_royal.jpg'
];

console.log('--- Checking cateloge.html contents ---');
console.log('Title:', fileContent.includes('<title>Catalogue & Lookbooks - MG Jewellers</title>') ? 'PASS' : 'FAIL');
console.log('MOCK_CATALOGUES exists:', fileContent.includes('const MOCK_CATALOGUES =') ? 'PASS' : 'FAIL');
console.log('openCatalogueLookbook exists:', fileContent.includes('function openCatalogueLookbook') ? 'PASS' : 'FAIL');
console.log('Filter chips container exists:', fileContent.includes('id="mg_catalogue_chips"') ? 'PASS' : 'FAIL');

images.forEach(img => {
  const inHtml = fileContent.includes(img);
  const existsOnDisk = fs.existsSync(img);
  console.log(`${img}: in HTML: ${inHtml}, on disk: ${existsOnDisk}`);
});

function checkUrl(urlPath) {
  return new Promise((resolve) => {
    http.get(`http://127.0.0.1:5501/${urlPath}`, (res) => {
      resolve({ path: urlPath, statusCode: res.statusCode });
    }).on('error', (err) => {
      resolve({ path: urlPath, error: err.message });
    });
  });
}

async function runHttpChecks() {
  console.log('\n--- Checking HTTP Endpoints on Local Dev Server ---');
  const catRes = await checkUrl('cateloge.html');
  console.log(`cateloge.html -> HTTP ${catRes.statusCode}`);

  for (const img of images) {
    const res = await checkUrl(img);
    console.log(`${img} -> HTTP ${res.statusCode}`);
  }
}

runHttpChecks();
