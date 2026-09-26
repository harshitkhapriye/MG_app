// =========================================================================
// BACKEND INTEGRATION POINT: Dynamic Theme & Vendor Injector
// In production, this can fetch vendor branding from:
//   fetch('/api/v1/vendor/' + vendorSlug).then(...)
// Right now, reads from MOCK_VENDOR_CONFIG (vendor-config.js)
// =========================================================================

(function () {
  'use strict';

  /**
   * Helper: Parse the current vendor slug from URL query string (?vendor=xxx)
   * @returns {string|null}
   */
  function getVendorSlug() {
    try {
      var params = new URLSearchParams(window.location.search);
      var vendor = params.get('vendor');
      return vendor ? vendor.trim().toLowerCase() : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Helper: Retrieve vendor configuration from global mock catalog
   * @param {string} slug
   * @returns {Object|null}
   */
  function getVendorConfig(slug) {
    if (!slug) return null;
    var catalog = window.MOCK_VENDOR_CONFIG || {};
    return catalog[slug] || null;
  }

  /**
   * Step 1: Inject CSS custom properties on :root
   * Sets --mg-gold-* and RGB triplet channels dynamically.
   * @param {Object} vendor
   */
  function injectThemeTokens(vendor) {
    if (!vendor || !vendor.colors) return;
    var root = document.documentElement;
    var colors = vendor.colors;

    for (var token in colors) {
      if (Object.prototype.hasOwnProperty.call(colors, token)) {
        root.style.setProperty(token, colors[token]);
      }
    }

    // Set semantic vendor attribute on root
    root.setAttribute('data-vendor-theme', vendor.slug);
  }

  /**
   * Step 2: Update dynamic DOM assets (logos, shop titles, copyright text)
   * @param {Object} vendor
   */
  function updateBrandingElements(vendor) {
    if (!vendor) return;

    // 1. Update Document Title
    if (vendor.shopName) {
      if (document.title.includes('MG Jwellers') || document.title.includes('MG Jewellers')) {
        document.title = document.title.replace(/MG Jwellers|MG Jewellers/g, vendor.shopName);
      } else if (!document.title.includes(vendor.shopName)) {
        document.title = vendor.shopName + ' | ' + document.title;
      }
    }

    // 2. Update Favicon
    if (vendor.faviconUrl) {
      var favicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
      favicons.forEach(function (icon) {
        icon.setAttribute('href', vendor.faviconUrl);
      });
    }

    // 3. Update Header & Footer Logos
    if (vendor.logoUrl) {
      var logos = document.querySelectorAll('.logo_image, #header-placeholder img.logo_image, #footer-placeholder img.footer-logo');
      logos.forEach(function (img) {
        img.src = vendor.logoUrl;
        if (vendor.shopName) img.alt = vendor.shopName;
      });
    }

    // 4. Update Footer Copyright text & links
    if (vendor.shopName) {
      var copyrightLinks = document.querySelectorAll('#footer-placeholder a u, footer a u');
      copyrightLinks.forEach(function (u) {
        if (u.textContent.includes('MG Jwellers') || u.textContent.includes('MG Jewellers')) {
          u.textContent = vendor.shopName;
        }
      });

      // 5. Update LiveChat welcome banner text if present
      var chatWelcome = document.querySelector('.mg-livechat-welcome');
      if (chatWelcome && chatWelcome.textContent.includes('MG Jewellers')) {
        chatWelcome.textContent = chatWelcome.textContent.replace('MG Jewellers', vendor.shopName);
      }
    }
  }

  /**
   * Main Initialization Routine
   */
  function initThemeInjector() {
    var vendorSlug = getVendorSlug();

    // RULE: If no ?vendor= parameter is present, do nothing!
    // The page remains 100% unaltered with default MG Jewellers styling.
    if (!vendorSlug) {
      return;
    }

    var vendor = getVendorConfig(vendorSlug);
    if (!vendor) {
      console.warn('[ThemeInjector] Unknown vendor slug: "' + vendorSlug + '". Available vendors:', Object.keys(window.MOCK_VENDOR_CONFIG || {}));
      return;
    }

    // A. Apply tokens immediately to prevent FOUC (Flash of Unstyled Content)
    injectThemeTokens(vendor);

    // B. Apply branding updates immediately for existing elements
    updateBrandingElements(vendor);

    // C. Re-apply branding once DOMContentLoaded fires
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        updateBrandingElements(vendor);
      });
    }

    // D. Re-apply branding when header.html & footer.html finish injecting via include.js
    document.addEventListener('headerFooterReady', function () {
      updateBrandingElements(vendor);
    });

    // E. MutationObserver safety net for asynchronous partial inclusions
    var observer = new MutationObserver(function () {
      updateBrandingElements(vendor);
    });

    var headerPlaceholder = document.getElementById('header-placeholder');
    var footerPlaceholder = document.getElementById('footer-placeholder');

    if (headerPlaceholder) observer.observe(headerPlaceholder, { childList: true, subtree: true });
    if (footerPlaceholder) observer.observe(footerPlaceholder, { childList: true, subtree: true });

    // Disconnect observer after 4 seconds once everything is fully settled
    setTimeout(function () {
      observer.disconnect();
    }, 4000);
  }

  // Execute immediately
  initThemeInjector();

  // Expose helper on window for dev console testing
  if (typeof window !== 'undefined') {
    window.setVendorTheme = function (slug) {
      var vendor = getVendorConfig(slug);
      if (vendor) {
        injectThemeTokens(vendor);
        updateBrandingElements(vendor);
        console.log('[ThemeInjector] Applied vendor theme:', slug);
      } else {
        console.error('[ThemeInjector] Invalid vendor slug:', slug);
      }
    };
  }
})();
