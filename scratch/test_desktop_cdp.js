const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const tempDir = path.join(require('os').tmpdir(), 'chrome_cdp_profile_' + Date.now());

const chromeProc = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9333',
  '--user-data-dir=' + tempDir,
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check'
]);

chromeProc.on('error', (err) => {
  console.error('Failed to spawn Chrome:', err);
  process.exit(1);
});

// Wait for port 9333 to become available
function checkPort(retries = 30) {
  if (retries === 0) {
    console.error('Chrome CDP did not start in time');
    chromeProc.kill();
    process.exit(1);
  }
  http.get('http://127.0.0.1:9333/json/version', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Connected to Chrome DevTools Protocol on 9333!');
      runTest();
    });
  }).on('error', () => {
    setTimeout(() => checkPort(retries - 1), 300);
  });
}

async function runTest() {
  http.get('http://127.0.0.1:9333/json/list', (res) => {
    let raw = '';
    res.on('data', chunk => raw += chunk);
    res.on('end', async () => {
      const targets = JSON.parse(raw);
      console.log('Targets found:', targets.length);
      const target = targets.find(t => t.type === 'page') || targets[0];
      const wsUrl = target.webSocketDebuggerUrl;
      console.log('Using WebSocket:', wsUrl);

      const ws = new WebSocket(wsUrl);
      let idCounter = 1;
      const pending = new Map();

      function send(method, params = {}) {
        return new Promise((resolve) => {
          const id = idCounter++;
          pending.set(id, resolve);
          ws.send(JSON.stringify({ id, method, params }));
        });
      }

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && pending.has(msg.id)) {
          const resolve = pending.get(msg.id);
          pending.delete(msg.id);
          resolve(msg.result);
        }
      };

      ws.onopen = async () => {
        console.log('WebSocket connected. Initializing page...');
        await send('Page.enable');
        await send('DOM.enable');
        await send('CSS.enable');

        // Set viewport to 1440x900
        await send('Emulation.setDeviceMetricsOverride', {
          width: 1440,
          height: 900,
          deviceScaleFactor: 1,
          mobile: false
        });

        // Navigate
        await send('Page.navigate', { url: 'http://127.0.0.1:5501/index.html?vendor=demo-vendor-2' });

        // Wait 3 seconds for header/footer partials & DOM to settle
        await new Promise(r => setTimeout(r, 3000));

        // Evaluate desktop elements and theme properties
        const evalRes = await send('Runtime.evaluate', {
          expression: `
            (() => {
              const root = document.documentElement;
              const styles = getComputedStyle(root);
              const header = document.querySelector('.header-main') || document.querySelector('header');
              const searchBar = document.querySelector('#head_search_bar');
              const searchInput = document.querySelector('#head_search_bar input') || document.querySelector('input.search-input');
              const searchBtn = document.querySelector('#head_search_bar button') || document.querySelector('#head_search_bar .search-btn');
              const logo = document.querySelector('.logo_image');
              const navLinks = Array.from(document.querySelectorAll('.navbar-nav .nav-link, .menu-list a')).slice(0, 5).map(a => ({
                text: a.textContent.trim(),
                color: getComputedStyle(a).color
              }));
              const categoryCards = Array.from(document.querySelectorAll('.matterial_block, .cat_block, .scheme-card, .product-item')).slice(0, 5).map(el => ({
                class: el.className,
                bg: getComputedStyle(el).backgroundColor,
                border: getComputedStyle(el).borderColor
              }));
              const primaryBtn = document.querySelector('.btn-primary');

              return {
                title: document.title,
                vendorThemeAttr: root.getAttribute('data-vendor-theme'),
                rootTokens: {
                  '--mg-gold-1': styles.getPropertyValue('--mg-gold-1').trim(),
                  '--mg-gold-1-rgb': styles.getPropertyValue('--mg-gold-1-rgb').trim(),
                  '--mg-gold-2': styles.getPropertyValue('--mg-gold-2').trim(),
                  '--mg-gold-2-rgb': styles.getPropertyValue('--mg-gold-2-rgb').trim(),
                  '--mg-gold-3': styles.getPropertyValue('--mg-gold-3').trim(),
                  '--mg-gold-3-rgb': styles.getPropertyValue('--mg-gold-3-rgb').trim(),
                  '--mg-gold-4': styles.getPropertyValue('--mg-gold-4').trim(),
                  '--mg-gold-4-rgb': styles.getPropertyValue('--mg-gold-4-rgb').trim(),
                  '--mg-gold-champagne': styles.getPropertyValue('--mg-gold-champagne').trim(),
                  '--mg-gold-champagne-rgb': styles.getPropertyValue('--mg-gold-champagne-rgb').trim()
                },
                logo: logo ? { src: logo.src, alt: logo.alt } : null,
                searchBar: searchBar ? {
                  display: getComputedStyle(searchBar).display,
                  border: getComputedStyle(searchBar).borderColor
                } : 'Not found',
                primaryBtn: primaryBtn ? {
                  bg: getComputedStyle(primaryBtn).backgroundColor,
                  border: getComputedStyle(primaryBtn).borderColor,
                  color: getComputedStyle(primaryBtn).color
                } : 'No btn-primary',
                navLinks,
                categoryCards
              };
            })()
          `,
          returnByValue: true
        });

        console.log('\n=== COMPUTED RESULTS AT 1440px DESKTOP ===');
        console.log(JSON.stringify(evalRes.result.value, null, 2));

        // Take a screenshot
        const screenshotRes = await send('Page.captureScreenshot', { format: 'png' });
        if (screenshotRes && screenshotRes.data) {
          const buffer = Buffer.from(screenshotRes.data, 'base64');
          const shotPath = path.join(__dirname, 'desktop_1440_demo_vendor_2.png');
          fs.writeFileSync(shotPath, buffer);
          console.log('\nScreenshot successfully saved to:', shotPath);
        }

        // Close page and Chrome
        await send('Page.close');
        ws.close();
        chromeProc.kill();
        process.exit(0);
      };
    });
  });
}

checkPort();
