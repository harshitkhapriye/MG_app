// =========================================================================
// BACKEND INTEGRATION POINT: Replace mock data below with real API endpoint
// Target Endpoint: GET /api/v1/vendor/config?vendor={slug}
// TEMPORARY DEMO DATA — will be replaced by backend API response
// =========================================================================

/**
 * Centralized mock vendor configuration catalog.
 * Defines custom brand palette tokens, logos, and business names for multi-tenant shops.
 */
const MOCK_VENDOR_CONFIG = {
  "mg-jewellers": {
    slug: "mg-jewellers",
    shopName: "MG Jewellers",
    tagline: "Certified Hallmark Jewellery",
    logoUrl: "assets/ecomm/logos/1755865437532699141.png",
    faviconUrl: "assets/ecomm/logos/1755865437532699141.png",
    colors: {
      "--mg-gold-1": "#a8802a",
      "--mg-gold-1-rgb": "168, 128, 42",
      "--mg-gold-2": "#d4af37",
      "--mg-gold-2-rgb": "212, 175, 55",
      "--mg-gold-3": "#f2dd9a",
      "--mg-gold-3-rgb": "242, 221, 154",
      "--mg-gold-4": "#b8912b",
      "--mg-gold-4-rgb": "184, 145, 43",
      "--mg-gold-champagne": "#d9b566",
      "--mg-gold-champagne-rgb": "217, 181, 102"
    }
  },
  "demo-vendor-2": {
    slug: "demo-vendor-2",
    shopName: "Demo Jewellers",
    tagline: "Royal Heritage & Solitaires",
    logoUrl: "assets/ecomm/logos/demo_vendor_logo.svg",
    faviconUrl: "assets/ecomm/logos/demo_vendor_logo.svg",
    colors: {
      "--mg-gold-1": "#800f2f",          // Deep ruby / garnet
      "--mg-gold-1-rgb": "128, 15, 47",
      "--mg-gold-2": "#c9184a",          // Rich crimson / royal maroon
      "--mg-gold-2-rgb": "201, 24, 74",
      "--mg-gold-3": "#ffb3c1",          // Soft rose quartz tint
      "--mg-gold-3-rgb": "255, 179, 193",
      "--mg-gold-4": "#a4133c",          // Antique ruby accent
      "--mg-gold-4-rgb": "164, 19, 60",
      "--mg-gold-champagne": "#e05780",   // Rosé highlight
      "--mg-gold-champagne-rgb": "224, 87, 128"
    }
  },
  "blue-vendor": {
    vendorId: "blue-vendor",
    slug: "blue-vendor",
    shopName: "Blue Diamonds Jewellers",
    tagline: "Fine Jewellery & Solitaires",
    logoUrl: "assets/ecomm/logos/blue_vendor_logo.svg",
    faviconUrl: "assets/ecomm/logos/blue_vendor_logo.svg",
    colors: {
      "--mg-gold-1": "#0c2444",          // Deep royal midnight sapphire
      "--mg-gold-1-rgb": "12, 36, 68",
      "--mg-gold-2": "#1b5fb8",          // Brilliant royal sapphire blue
      "--mg-gold-2-rgb": "27, 95, 184",
      "--mg-gold-3": "#b8d5f8",          // Ice diamond / crystalline blue tint
      "--mg-gold-3-rgb": "184, 213, 248",
      "--mg-gold-4": "#14467d",          // Deep cobalt accent
      "--mg-gold-4-rgb": "20, 70, 125",
      "--mg-gold-champagne": "#5b96e0",   // Cerulean sparkle / sapphire highlight
      "--mg-gold-champagne-rgb": "91, 150, 224"
    }
  }
};

// Expose globally in browser environments
if (typeof window !== "undefined") {
  window.MOCK_VENDOR_CONFIG = MOCK_VENDOR_CONFIG;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = MOCK_VENDOR_CONFIG;
}
