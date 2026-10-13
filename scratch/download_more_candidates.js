const https = require('https');
const fs = require('fs');
const path = require('path');

const ids = [
  'photo-1764181237984-70ac5f211b06',
  'photo-1649413437201-79bf2a6a261c',
  'photo-1598560917505-59a3ad559071',
  'photo-1617038220319-276d3cfab638'
];

async function download(id) {
  return new Promise((resolve) => {
    const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&h=1000&q=80`;
    const dest = path.join(__dirname, 'candidates', `${id}.jpg`);
    const file = fs.createWriteStream(dest);

    https.get(url, res => {
      if (res.statusCode !== 200) {
        console.log(`❌ ${id} status ${res.statusCode}`);
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        return resolve(null);
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✅ ${id} saved ${(fs.statSync(dest).size / 1024).toFixed(1)} KB`);
        resolve(dest);
      });
    }).on('error', err => {
      console.log(`❌ ${id} error: ${err.message}`);
      resolve(null);
    });
  });
}

async function run() {
  for (const id of ids) {
    await download(id);
  }
}

run();
