const fs = require('fs');
const path = require('path');

const mobileConversions = JSON.parse(fs.readFileSync(path.join(__dirname, 'mobile_scoped_conversions.json'), 'utf8'));
console.log('Total mobile scoped conversions count:', mobileConversions.length);

// Group mobile conversions by file + selector
const components = {};
mobileConversions.forEach(c => {
  let key = c.file + ' -> ' + c.selector;
  if (!components[key]) components[key] = [];
  components[key].push(c);
});

console.log('\n--- GROUPED MOBILE-SCOPED CONVERSIONS (' + Object.keys(components).length + ' distinct selectors) ---');
for (const [k, v] of Object.entries(components)) {
  console.log(`\nSelector: ${k}`);
  console.log(`  Media: ${v[0].media}`);
  v.forEach(item => {
    console.log(`  Line ${item.lineNo}: ${item.code}`);
  });
}
