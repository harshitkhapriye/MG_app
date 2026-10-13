const https = require('https');
const fs = require('fs');
const path = require('path');

const candidates = [
  { id: 'photo-1599643478518-a784e5dc4c8f', name: 'men_chain_flatlay' },
  { id: 'photo-1635767798638-3e25273a8236', name: 'kids_earrings_studs' },
  { id: 'photo-1630019852942-f89202989a59', name: 'kids_hoops_small' },
  { id: 'photo-1758995115682-1452a1a9e35b', name: 'women_necklace_bust' },
  { id: 'photo-1603561591411-07134e71a2a9', name: 'gemstone_gold' },
  { id: 'photo-1622398925373-3f9101e275f5', name: 'men_chain_gold' },
  { id: 'photo-1599643477877-530eb83abc8e', name: 'gold_chain_link' },
  { id: 'photo-1617038260897-41a1f14a8ca0', name: 'gold_necklace_set' },
  { id: 'photo-1588444837495-c6cfeb53f32d', name: 'gold_bracelet_bangles' },
  { id: 'photo-1535632066927-ab7c9ab60908', name: 'gold_studs' },
  { id: 'photo-1611652022419-a9419f74343d', name: 'gold_jewelry_minimal' }
];

async function download(c) {
  return new Promise((resolve) => {
    // 800px width, 1000px height (4:5 ratio)
    const url = `https://images.unsplash.com/${c.id}?auto=format&fit=crop&w=800&h=1000&q=80`;
    const dest = path.join(__dirname, 'candidates', `${c.name}.jpg`);
    const file = fs.createWriteStream(dest);

    https.get(url, res => {
      if (res.statusCode !== 200) {
        console.log(`❌ ${c.name} (${c.id}) failed with status ${res.statusCode}`);
        file.close();
        fs.unlinkSync(dest);
        return resolve(null);
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        const size = fs.statSync(dest).size;
        console.log(`✅ ${c.name} (${c.id}) saved: ${(size / 1024).toFixed(1)} KB`);
        resolve({ ...c, file: dest, size });
      });
    }).on('error', err => {
      console.log(`❌ ${c.name} error: ${err.message}`);
      resolve(null);
    });
  });
}

async function run() {
  const dir = path.join(__dirname, 'candidates');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (const c of candidates) {
    await download(c);
  }
}

run();
