const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'assets', 'ecomm', 'images', 'unsplash');
const candDir = path.join(__dirname, 'candidates');
const artDir = 'C:/Users/harsh/.gemini/antigravity-ide/brain/783d4320-9fb4-41af-a5f3-e6757bee69cb';

// 1. material_silver.jpg <- photo-1605100804763-247f67b3557e.jpg
fs.copyFileSync(path.join(candDir, 'photo-1605100804763-247f67b3557e.jpg'), path.join(targetDir, 'material_silver.jpg'));
fs.copyFileSync(path.join(candDir, 'photo-1605100804763-247f67b3557e.jpg'), path.join(artDir, 'material_silver.jpg'));
console.log('Updated material_silver.jpg');

// 2. legacy_story_1973.jpg <- generated workshop image
const genImage = path.join(artDir, 'goldsmith_workshop_1973_1790318025684.jpg');
fs.copyFileSync(genImage, path.join(targetDir, 'legacy_story_1973.jpg'));
fs.copyFileSync(genImage, path.join(artDir, 'legacy_story_1973.jpg'));
console.log('Updated legacy_story_1973.jpg');

// 3. legacy_story_purity.jpg <- photo-1515562141207-7a88fb7ce338.jpg
fs.copyFileSync(path.join(candDir, 'photo-1515562141207-7a88fb7ce338.jpg'), path.join(targetDir, 'legacy_story_purity.jpg'));
fs.copyFileSync(path.join(candDir, 'photo-1515562141207-7a88fb7ce338.jpg'), path.join(artDir, 'legacy_story_purity.jpg'));
console.log('Updated legacy_story_purity.jpg');

// 4. hero_slide_gold.jpg <- photo-1758995115682-1452a1a9e35b.jpg
fs.copyFileSync(path.join(candDir, 'photo-1758995115682-1452a1a9e35b.jpg'), path.join(targetDir, 'hero_slide_gold.jpg'));
fs.copyFileSync(path.join(candDir, 'photo-1758995115682-1452a1a9e35b.jpg'), path.join(artDir, 'hero_slide_gold.jpg'));
console.log('Updated hero_slide_gold.jpg');
