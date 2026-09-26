const https = require('https');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'assets', 'ecomm', 'images', 'unsplash');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const batch1 = [
  // 1. Shop By Material (4 images)
  {
    filename: 'material_gold.jpg',
    url: 'https://images.unsplash.com/photo-1758995116288-278d7387cbb6?auto=format&fit=crop&w=800&q=80',
    section: 'Shop By Material -> Gold',
    description: 'Stack of ornate traditional gold bangles with warm gold reflections'
  },
  {
    filename: 'material_silver.jpg',
    url: 'https://images.unsplash.com/photo-1541112324160-e8a425b58dac?auto=format&fit=crop&w=800&q=80',
    section: 'Shop By Material -> Silver',
    description: 'Handcrafted sterling silver rings with brilliant metallic luster'
  },
  {
    filename: 'material_artificial.jpg',
    url: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=800&q=80',
    section: 'Shop By Material -> Artificial',
    description: 'Traditional handcrafted Kundan/Polki gold-plated statement jewellery'
  },
  {
    filename: 'material_stone.jpg',
    url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80',
    section: 'Shop By Material -> Stone',
    description: 'Precious colored gemstone ring with emerald/ruby in fine gold setting'
  },

  // 2. Our Legacy Story Blocks (4 images)
  {
    filename: 'legacy_story_1973.jpg',
    url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=900&h=650&q=80',
    section: 'Our Legacy -> Block 1 (Where It All Began - 1973)',
    description: 'Traditional goldsmith workshop tools, anvil, and artisan workbench'
  },
  {
    filename: 'legacy_story_craftsmanship.jpg',
    url: 'https://images.unsplash.com/photo-1772442125267-7640b4b5f2fe?auto=format&fit=crop&w=900&h=650&q=80',
    section: 'Our Legacy -> Block 2 (Craftsmanship That Speaks)',
    description: 'Master artisan jeweler meticulously handcrafting and setting jewelry'
  },
  {
    filename: 'legacy_story_purity.jpg',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&h=650&q=80',
    section: 'Our Legacy -> Block 3 (Our Promise - Hallmark Purity)',
    description: 'Certified pure hallmark gold bullion coins and bars'
  },
  {
    filename: 'legacy_story_celebrations.jpg',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&h=650&q=80',
    section: 'Our Legacy -> Block 4 (Looking Ahead - Celebrations)',
    description: 'Royal Indian bride wearing heirloom bridal jewellery in an opulent setting'
  },

  // 3. Hero Carousel Slides 2 & 3 (2 images)
  {
    filename: 'hero_slide_bridal.jpg',
    url: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1920&h=1080&q=85',
    section: 'Hero Carousel -> Slide 2 (Bridal Collection 2025)',
    description: 'Cinematic royal bridal necklace and earrings ensemble panoramic banner'
  },
  {
    filename: 'hero_slide_gold.jpg',
    url: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1920&h=1080&q=85',
    section: 'Hero Carousel -> Slide 3 (Certified Hallmark - Gold You Can Trust)',
    description: 'Luxury gold jewellery collection on warm ivory silk background'
  }
];

function downloadFile(item) {
  return new Promise((resolve, reject) => {
    const dest = path.join(targetDir, item.filename);
    const get = (url) => {
      https.get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(res.headers.location);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`Failed to download ${item.filename}: HTTP ${res.statusCode}`));
        }
        const fileStream = fs.createWriteStream(dest);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close(() => {
            const sizeKb = Math.round(fs.statSync(dest).size / 1024);
            resolve({
              filename: item.filename,
              section: item.section,
              description: item.description,
              sizeKb: sizeKb + ' KB',
              path: 'assets/ecomm/images/unsplash/' + item.filename
            });
          });
        });
      }).on('error', reject);
    };
    get(item.url);
  });
}

async function run() {
  console.log('Starting Batch 1 download (' + batch1.length + ' images)...');
  const results = [];
  for (const item of batch1) {
    try {
      const res = await downloadFile(item);
      results.push(res);
      console.log(`✅ Downloaded: ${res.filename} (${res.sizeKb}) -> ${res.section}`);
    } catch (err) {
      console.error(`❌ Error downloading ${item.filename}:`, err.message);
    }
  }

  console.log('\nAll Batch 1 downloads completed: ' + results.length + '/' + batch1.length);
  fs.writeFileSync(path.join(__dirname, 'batch1_download_results.json'), JSON.stringify(results, null, 2));
}

run();
