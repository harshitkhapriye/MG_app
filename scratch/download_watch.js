const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&h=1000&q=80';
const dest = path.join(__dirname, 'candidates', 'watch_or_jewelry.jpg');
const file = fs.createWriteStream(dest);

https.get(url, res => {
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Saved watch_or_jewelry.jpg', fs.statSync(dest).size, 'bytes');
  });
});
