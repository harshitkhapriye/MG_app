const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const out = path.join(__dirname, 'desktop_1440.png');
const url = 'http://127.0.0.1:5501/index.html?vendor=demo-vendor-2';
const tempProfile = 'C:\\Users\\harsh\\AppData\\Local\\Temp\\chrome_headless_test';

const args = [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--user-data-dir=' + tempProfile,
  '--window-size=1440,900',
  '--screenshot=' + out,
  url
];

console.log('Spawning Chrome headless...');
const res = spawnSync(chrome, args, { encoding: 'utf8', timeout: 15000 });
console.log('Exit code:', res.status);
if (res.error) console.error('Error:', res.error);
console.log('Screenshot exists:', fs.existsSync(out));
if (fs.existsSync(out)) {
  console.log('File size:', fs.statSync(out).size);
}
