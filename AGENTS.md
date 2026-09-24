# Frontend Senior Developer Handoff Standards & Coding Guidelines

This project is a UI/frontend implementation that will be handed over to a senior backend developer for real backend integration (APIs, dynamic database models, authentication, cart/order management, rate ticker streams).

To ensure zero merge conflicts, zero breakage, and a completely seamless handoff, ALL future work across this codebase must adhere strictly to these 6 core rules:

## 1. Clear, Semantic IDs, Classes & Data Attributes
- Every UI element that displays dynamic backend data must feature clear, descriptive IDs, class names, and `data-*` attributes.
- Examples:
  - `data-product-id="MG-G-101"`
  - `data-price="45200"`
  - `data-stock="in_stock"`
  - `id="cart_item_row_101"`
  - `class="mg-cart-product-title"`
- This allows the senior backend developer to instantly target and populate elements via Blade/templating or API response binding without refactoring styles.

## 2. Centralized Mock / Placeholder Data
- Never scatter hardcoded prices, stock counts, product names, or coupon lists inside deep inline HTML or disparate scripts.
- Consolidate all mock/placeholder data into clear, top-level JavaScript objects or arrays (e.g., `MOCK_CART_ITEMS`, `MOCK_COUPONS`, `MOCK_WISHLIST_ITEMS`).
- Maintain single sources of truth so replacing mock fixtures with live `fetch()` / Axios API calls is a 1-line swap for the backend engineer.

## 3. Modular, Dedicated Action Functions
- Keep UI JavaScript functions modular, self-contained, and semantically named:
  - `moveToWishlist(productId)`
  - `moveToCart(productId)`
  - `applyCoupon(couponCode)`
  - `removeCartItem(productId)`
  - `updateItemQuantity(productId, newQty)`
  - `toggleMobileSearch(action)`
- Avoid deeply nested anonymous inline handlers. The senior developer should be able to simply inject `fetch('/api/cart/remove', ...)` inside the function body without touching UI rendering logic.

## 4. Decoupled UI Logic & Resilient Data Consumption
- Avoid tightly coupling UI components to rigid assumptions about backend schema shape.
- Write defensive helper functions to parse responses safely (handling missing fields, defaults, numbers vs formatted currency strings).
- Ensure UI states gracefully handle loading, empty, and populated states.

## 5. Explicit Backend Integration Comments
- Prepend every mock data object, mock API delay simulation, and dummy validation with concise, standardized comments:
  ```javascript
  // =========================================================================
  // BACKEND INTEGRATION POINT: Replace mock data below with real API endpoint
  // Target Endpoint: GET /api/v1/cart/items
  // =========================================================================
  ```
- Make it crystal clear what is temporary frontend mock logic and how real data hooks in.

## 6. Clean, Non-Duplicative, Regression-Free Code
- Keep all styles scoped and tied to established theme tokens (`--mg-gold-1`, `--mg-gold-2`, `--mg-ink`, etc.).
- Never duplicate event listeners or create conflicting CSS overrides.
- Maintain mobile vs desktop scoping cleanly (mobile changes inside `@media (max-width: 991.98px)`).
