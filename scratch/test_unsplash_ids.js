const https = require('https');

const candidates = [
  // Gold & Necklaces
  { id: 'photo-1599643478518-17488fbbcd75', desc: 'Gold necklace with pearl / elegant jewelry' },
  { id: 'photo-1515562141207-7a88fb7ce338', desc: 'Gold jewelry collection / luxury gold' },
  { id: 'photo-1535632066927-ab7c9ab60908', desc: 'Gold earrings / minimal gold' },
  { id: 'photo-1605100804763-247f67b3557e', desc: 'Diamond engagement ring / gold band' },
  { id: 'photo-1611591475883-9b2447d2f476', desc: 'Gold rings / bangles on marble' },
  { id: 'photo-1573408301185-9146fe634ad0', desc: 'Luxury necklace / gold jewelry' },
  { id: 'photo-1598560917505-59a3ad559071', desc: 'Gold and diamond jewelry flatlay' },
  { id: 'photo-1602751584552-8ba73aad10e1', desc: 'Gold chain necklace' },
  { id: 'photo-1506630448388-4e683c67ddb0', desc: 'Artisan jeweler / craft' },
  { id: 'photo-1541112324160-e8a425b58dac', desc: 'Silver rings / jewelry' },
  { id: 'photo-1603561591411-07134e71a2a9', desc: 'Gemstone ring / ruby emerald' },
  { id: 'photo-1617038220319-276d3cfab638', desc: 'Traditional / bridal jewelry' },
  { id: 'photo-1539185441755-769473a23570', desc: 'Artisan goldsmith workbench tools' },
  { id: 'photo-1610030469983-98e550d6193c', desc: 'Indian bride royal wedding jewelry' },
  { id: 'photo-1584308666744-24d5c474f2ae', desc: 'Gold coins / bullion purity' },
  { id: 'photo-1758995116288-278d7387cbb6', desc: 'Stack of ornate gold bangles' },
  { id: 'photo-1758995115682-1452a1a9e35b', desc: 'Gold necklace & earrings set' },
  { id: 'photo-1772442125267-7640b4b5f2fe', desc: 'Jeweler artisan working on ring at workbench' }
];

function checkPhoto(item) {
  return new Promise((resolve) => {
    const url = `https://images.unsplash.com/${item.id}?auto=format&fit=crop&w=400&q=70`;
    https.get(url, (res) => {
      resolve({ id: item.id, desc: item.desc, status: res.statusCode });
    }).on('error', (err) => resolve({ id: item.id, desc: item.desc, status: 'ERROR: ' + err.message }));
  });
}

async function run() {
  console.log('Testing Unsplash photo IDs...');
  for (const c of candidates) {
    const res = await checkPhoto(c);
    console.log(`${res.status === 200 ? '✅ 200 OK' : '❌ ' + res.status} | ${res.id} | ${res.desc}`);
  }
}

run();
