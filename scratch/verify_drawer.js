const fs = require('fs');
const http = require('http');

const header = fs.readFileSync('header.html', 'utf8');
const css = fs.readFileSync('assets/ecomm/css/theme-style.css', 'utf8');
const js = fs.readFileSync('assets/ecomm/js/theme-animations.js', 'utf8');

const checks = [
  { name: 'Greeting Hi Harshit! exists', pass: header.includes('Hi Harshit!') },
  { name: 'Redeem points removed', pass: !header.includes('Redeem<br>points') && !header.includes('mg-redeem-circle') },
  { name: 'Currency toggle removed', pass: !header.includes('mg-currency-toggle') },
  { name: 'Categories collapsible exists', pass: header.includes('id="mg_drawer_categories_btn"') && header.includes('id="mg_drawer_categories_collapse"') },
  { name: 'Shop For collapsible exists', pass: header.includes('id="mg_drawer_shop_for_btn"') && header.includes('id="mg_drawer_shop_for_collapse"') },
  { name: 'Women option included', pass: header.includes('<span>Women</span>') },
  { name: 'Metal rates quick link exists', pass: header.includes('id="mg_drawer_rates_link"') },
  { name: 'Wishlist count badge exists', pass: header.includes('id="mg_drawer_wishlist_count"') },
  { name: 'Cart count badge exists', pass: header.includes('id="mg_drawer_cart_count"') },
  { name: 'Live chat quick link exists', pass: header.includes('id="mg_drawer_chat_link"') },
  { name: 'Login/Register buttons preserved', pass: header.includes('id="mg_drawer_login_btn"') && header.includes('id="mg_drawer_reg_btn"') },
  { name: 'CSS has accordion transitions', pass: css.includes('.mg-drawer-collapse-content') && css.includes('.mg-drawer-row-toggle.active') },
  { name: 'JS has toggle handler', pass: js.includes('mg-drawer-row-toggle') && js.includes('syncDrawerBadges') }
];

console.log('--- Verification Checklist ---');
let allPassed = true;
checks.forEach(c => {
  console.log(`${c.name}: ${c.pass ? 'PASS' : 'FAIL'}`);
  if (!c.pass) allPassed = false;
});

http.get('http://127.0.0.1:5501/header.html', res => {
  console.log('\nheader.html HTTP Status:', res.statusCode);
});
