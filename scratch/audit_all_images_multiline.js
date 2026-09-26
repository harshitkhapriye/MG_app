const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

const allImages = [];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
  
  // Multiline match for <img ... >
  const imgMatches = content.matchAll(/<img\b([^>]*)>/gis);
  for (const m of imgMatches) {
    const attrs = m[1];
    const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
    const altMatch = attrs.match(/alt=["']([^"']+)["']/i);
    const idMatch = attrs.match(/id=["']([^"']+)["']/i);
    const classMatch = attrs.match(/class=["']([^"']+)["']/i);
    
    // Find approximate line number
    const upToMatch = content.slice(0, m.index);
    const lineNo = upToMatch.split(/\r?\n/).length;

    if (srcMatch) {
      allImages.push({
        file,
        line: lineNo,
        src: srcMatch[1],
        alt: altMatch ? altMatch[1] : '',
        id: idMatch ? idMatch[1] : '',
        className: classMatch ? classMatch[1] : '',
        raw: m[0]
      });
    }
  }

  // Background images in style attributes
  const bgMatches = content.matchAll(/style=["'][^"']*background(?:-image)?:\s*url\(['"]?([^'"\)]+)['"]?\)[^"']*["']/gis);
  for (const m of bgMatches) {
    const upToMatch = content.slice(0, m.index);
    const lineNo = upToMatch.split(/\r?\n/).length;
    allImages.push({
      file,
      line: lineNo,
      src: m[1],
      alt: '[CSS Background]',
      id: '',
      className: '',
      raw: m[0]
    });
  }
});

console.log('Total images across entire codebase:', allImages.length);

// Also inspect CSS files for background-image URLs
const cssDir = path.join(rootDir, 'assets', 'ecomm', 'css');
const eachCssDir = path.join(rootDir, 'ecom', 'each_css');
const cssFiles = [
  ...fs.readdirSync(cssDir).filter(f => f.endsWith('.css')).map(f => path.join('assets/ecomm/css', f)),
  ...fs.readdirSync(eachCssDir).filter(f => f.endsWith('.css')).map(f => path.join('ecom/each_css', f))
];

const cssImages = [];
cssFiles.forEach(rel => {
  const content = fs.readFileSync(path.join(rootDir, rel), 'utf8');
  const bgMatches = content.matchAll(/url\(['"]?([^'"\)]+\.(?:jpg|jpeg|png|webp|svg|gif)[^'"\)]*)['"]?\)/gi);
  for (const m of bgMatches) {
    cssImages.push({ file: rel, url: m[1] });
  }
});
console.log('CSS background images found:', cssImages.length);
cssImages.forEach(c => console.log(`  [${c.file}] ${c.url}`));

// Save detailed report
fs.writeFileSync(path.join(__dirname, 'all_images_audit.json'), JSON.stringify(allImages, null, 2));

// Filter for primary user-facing pages
const mainPages = ['index.html', 'our-legacy.html', 'about.html', 'shop.html', 'cateloge.html', 'categories.html', 'scheme.html', 'header.html', 'footer.html'];
const mainAudit = allImages.filter(i => mainPages.includes(i.file));

console.log('\n=== MAIN PAGES IMAGES (' + mainAudit.length + ' images) ===');
mainPages.forEach(p => {
  const pImgs = mainAudit.filter(i => i.file === p);
  if (pImgs.length === 0) return;
  console.log(`\n--- ${p} (${pImgs.length} images) ---`);
  pImgs.forEach(i => {
    console.log(`  Line ${i.line}: src="${i.src}" | alt="${i.alt}" | class="${i.className}"`);
  });
});
