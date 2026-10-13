const https = require('https');
const fs = require('fs');
const path = require('path');

const list = [
  'photo-1611591475883-9b2447d2f476',
  'photo-1599643478518-17488fbbcd75',
  'photo-1598560917505-59a3ad559071',
  'photo-1617038220319-276d3cfab638'
];

async function download(id) {
  return new Promise((resolve) => {
    const dest = path.join(__dirname, 'candidates', id + '.jpg');
    const file = fs.createWriteStream(dest);
    https.get(`https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=75`, res => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Saved', id, fs.statSync(dest).size, 'bytes');
        resolve();
      });
    }).on('error', err => {
      console.log('Error', id, err.message);
      resolve();
    });
  });
}

async function run() {
  for (const id of list) {
    await download(id);
  }
}

run();
