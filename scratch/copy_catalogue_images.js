const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\harsh\\.gemini\\antigravity-ide\\brain\\783d4320-9fb4-41af-a5f3-e6757bee69cb';
const projectDir = 'c:\\Users\\harsh\\OneDrive\\Desktop\\MG_app\\assets\\ecomm\\images\\catalogue';

if (!fs.existsSync(projectDir)) {
  fs.mkdirSync(projectDir, { recursive: true });
}

const files = [
  {
    src: 'catalogue_bridal_heritage_1790321051032.jpg',
    destName: 'catalogue_bridal_heritage.jpg'
  },
  {
    src: 'catalogue_festive_gold_clean_1790321802077.jpg',
    destName: 'catalogue_festive_gold.jpg'
  },
  {
    src: 'catalogue_temple_antique_1790321360703.jpg',
    destName: 'catalogue_temple_antique.jpg'
  },
  {
    src: 'catalogue_everyday_minimal_1790321493894.jpg',
    destName: 'catalogue_everyday_minimal.jpg'
  },
  {
    src: 'catalogue_mens_royal_1790321737394.jpg',
    destName: 'catalogue_mens_royal.jpg'
  }
];

for (const item of files) {
  const srcPath = path.join(brainDir, item.src);
  const destProjectPath = path.join(projectDir, item.destName);
  const destBrainPath = path.join(brainDir, item.destName);

  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destProjectPath);
    fs.copyFileSync(srcPath, destBrainPath);
    console.log(`Copied ${item.src} -> ${item.destName} (${fs.statSync(destProjectPath).size} bytes)`);
  } else {
    console.error(`Source not found: ${srcPath}`);
  }
}
