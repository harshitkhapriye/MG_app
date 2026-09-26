const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

const imageUsage = [];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
  const lines = content.split(/\r?\n/);

  lines.forEach((line, idx) => {
    // Match <img ... src="..."
    const imgMatches = line.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi);
    for (const match of imgMatches) {
      imageUsage.push({
        file,
        line: idx + 1,
        src: match[1],
        tag: match[0].slice(0, 150)
      });
    }

    // Match style="background-image: url(...)"
    const bgMatches = line.matchAll(/background(?:-image)?:\s*url\(['"]?([^'"\)]+)['"]?\)/gi);
    for (const match of bgMatches) {
      imageUsage.push({
        file,
        line: idx + 1,
        src: match[1],
        tag: 'CSS Background: ' + match[0]
      });
    }
  });
});

console.log('Total image references found:', imageUsage.length);

// Count occurrences of each src
const srcCount = {};
imageUsage.forEach(img => {
  srcCount[img.src] = (srcCount[img.src] || 0) + 1;
});

// Group by file for key pages
const keyPages = ['index.html', 'our-legacy.html', 'about.html', 'cateloge.html', 'categories.html', 'shop.html'];
const pageReport = {};

keyPages.forEach(p => {
  pageReport[p] = imageUsage.filter(img => img.file === p);
});

console.log('\n--- KEY PAGES IMAGE BREAKDOWN ---');
for (const [page, imgs] of Object.entries(pageReport)) {
  console.log(`\n=== ${page} (${imgs.length} images) ===`);
  const uniqueSrcs = [...new Set(imgs.map(i => i.src))];
  uniqueSrcs.forEach(src => {
    const lines = imgs.filter(i => i.src === src).map(i => i.line);
    console.log(`  - [Count: ${lines.length}, Lines: ${lines.join(', ')}] ${src}`);
  });
}

// Find repeated images across key pages
console.log('\n--- MOST FREQUENTLY REPEATED IMAGES ---');
const sorted = Object.entries(srcCount).sort((a, b) => b[1] - a[1]);
sorted.slice(0, 20).forEach(([src, count]) => {
  console.log(`${count}x: ${src}`);
});
