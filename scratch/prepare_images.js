const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'candidates');
const unsplashDir = path.join(__dirname, '..', 'assets', 'ecomm', 'images', 'unsplash');
const artifactDir = 'C:\\Users\\harsh\\.gemini\\antigravity-ide\\brain\\783d4320-9fb4-41af-a5f3-e6757bee69cb';

if (!fs.existsSync(unsplashDir)) {
  fs.mkdirSync(unsplashDir, { recursive: true });
}

// 1. Copy Primary Candidates to assets/ecomm/images/unsplash/
fs.copyFileSync(path.join(srcDir, 'men_chain_asset.jpg'), path.join(unsplashDir, 'gender_men.jpg'));
fs.copyFileSync(path.join(srcDir, 'kids_hoops_small.jpg'), path.join(unsplashDir, 'gender_kids.jpg'));
fs.copyFileSync(path.join(srcDir, 'women_necklace_bust.jpg'), path.join(unsplashDir, 'gender_women.jpg'));

console.log('Saved to assets/ecomm/images/unsplash/:');
console.log('gender_men.jpg:', (fs.statSync(path.join(unsplashDir, 'gender_men.jpg')).size / 1024).toFixed(1), 'KB');
console.log('gender_kids.jpg:', (fs.statSync(path.join(unsplashDir, 'gender_kids.jpg')).size / 1024).toFixed(1), 'KB');
console.log('gender_women.jpg:', (fs.statSync(path.join(unsplashDir, 'gender_women.jpg')).size / 1024).toFixed(1), 'KB');

// 2. Copy all candidates to artifact directory for markdown preview
const artifactCopies = [
  { from: 'men_chain_asset.jpg', to: 'preview_men_1_chain.jpg' },
  { from: 'men_chain_flatlay.jpg', to: 'preview_men_2_flatlay.jpg' },
  { from: 'kids_hoops_small.jpg', to: 'preview_kids_1_heart_hoops.jpg' },
  { from: 'gold_necklace_set.jpg', to: 'preview_kids_2_twisted_hoops.jpg' },
  { from: 'women_necklace_bust.jpg', to: 'preview_women_1_bust.jpg' },
  { from: 'gold_jewelry_minimal.jpg', to: 'preview_women_2_neck_crop.jpg' }
];

artifactCopies.forEach(item => {
  const s = path.join(srcDir, item.from);
  const d = path.join(artifactDir, item.to);
  if (fs.existsSync(s)) {
    fs.copyFileSync(s, d);
    console.log('Artifact preview ready:', item.to, (fs.statSync(d).size / 1024).toFixed(1), 'KB');
  }
});
