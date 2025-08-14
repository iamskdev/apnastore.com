# Naye Views (Tabs) Kaise Implement Karein

Yeh guide aapko batayegi ki "Saved", "Cart" jaise naye tabs ke liye functionality kaise add karein. Hamara project modular (chote-chote hisson mein bata hua) hai, isliye naye features add karna bahut aasan hai.

Hum "Cart" tab ko implement karne ka example lenge.

---

### Step 1: `index.html` Mein Placeholder Hatayein

Abhi `index.html` mein "Cart" view ke liye ek placeholder `div` hai.

**Purana Code (`index.html`):**
```html
<div id="cart-view" class="page-view hidden placeholder-view"><h2>Shopping Cart</h2><p>Coming Soon...</p></div>
```

Aapko is placeholder ko apne naye cart ke actual HTML content se badalna hai.

**Naya Code (`index.html`):**
```html
<div id="cart-view" class="page-view hidden">
  <!-- Yahan aapka cart ka poora HTML aayega -->
  <h2>My Shopping Cart</h2>
  <div id="cart-items-container">
    <!-- Cart items yahan JavaScript se load honge -->
  </div>
  <div class="cart-summary">
    <p>Total: <span id="cart-total">₹0</span></p>
    <button>Proceed to Checkout</button>
  </div>
</div>
```

---

### Step 2: Naya JavaScript Module Banayein

Har view ka apna logic ek alag file mein hota hai. Isse code saaf rehta hai.

1.  `public/scripts/views/` folder mein ek nayi file banayein: `cart-view.js`.
2.  Is file mein, cart se juda saara JavaScript code likhein. Ek `initializeCartView` function banayein jo saara setup karega.

**Example (`public/scripts/views/cart-view.js`):**
```javascript
/**
 * @file Manages all logic for the Cart page view.
 */

function renderCartItems() {
  const container = document.getElementById('cart-items-container');
  // Yahan aap cart ke items ko render karne ka logic likhenge.
  container.innerHTML = "<p>Your cart is empty.</p>"; 
}

/**
 * Initializes the Cart view, setting up initial state and event listeners.
 */
export function initializeCartView() {
  console.log("🛒 Cart View Initialized!");
  renderCartItems();
  
  // Yahan aap checkout button ke liye event listener laga sakte hain.
}
```

---

### Step 3: `main-script.js` Mein Naye Module ko Load Karein

Ab `main-script.js` ko batana hoga ki is naye module ko bhi load karna hai.

1.  `main-script.js` mein, nayi file ko `import` karein.
2.  `initializeApp` function ke andar, uske initialization function ko call karein.

**Changes in `main-script.js`:**
```javascript
// Sabse upar, doosre imports ke saath
import { initializeCartView } from './views/cart-view.js'; 
// ... (baaki imports)

async function initializeApp() {
  // ... (baaki code)

  // Initialize UI modules that don't depend on data
  initializeAccountView();
  initializeCartView(); // Naye view ko yahan initialize karein

  // ... (baaki code)
}
```

---

### Sabhi 4 Roles Ke Liye Implementation

Hamare project mein 4 roles hain: **Guest, User, Admin, aur Developer**. Naye tabs jodte waqt, do alag-alag patterns ka istemal hota hai:

#### Pattern 1: SPA Views (Guest, User, Admin ke liye)
Yeh roles `index.html` ke andar alag-alag `<div>` views ko dikhate aur chhipate hain.

1.  **Create the View:** Add a new view `div` in `index.html` (e.g., `<div id="new-feature-view" class="page-view hidden">...</div>`).
2.  **Create the Logic:** Create a new JavaScript module for its logic in `public/scripts/views/` (e.g., `new-feature-view.js`).
3.  **Initialize the Logic:** Import and call the initialization function for your new view in `public/scripts/main-script.js`.
4.  **Update Navigation:**
    *   In `bottom-nav.html`, add a new `.nav-item` with a unique `data-tab` attribute for the relevant role (e.g., `.user-only`, `.admin-only`).
    *   `bottom-nav.html` ke script mein `viewMap` object ko update karein taaki naya `data-tab` nayi view ID se jud jaaye.

#### Pattern 2: Alag HTML Pages (Developer ke liye)
Developer role seedhe alag-alag HTML pages par link karta hai.

1.  **Create the Page:** Create a new HTML page in the `developer/pages/` directory (e.g., `new-tool.html`).
2.  **Update Navigation:** `bottom-nav.html` mein, seedhe ek naya link jodein: `<a href="/src/modules/admin/pages/new-tool.html" class="nav-item dev-only">...</a>`. Iske liye `viewMap` mein badlaav ki zaroorat nahi hai.

---

### Step 4: `bottom-nav.html` Check Karein (Optional)

Aapka `bottom-nav.html` pehle se hi "Cart" tab ke liye set hai. Woh `data-tab="cart"` ko `id="cart-view"` se jodta hai. Isliye yahan koi badlav ki zaroorat nahi hai.

Agar aap koi bilkul naya tab banate hain, to aapko `bottom-nav.html` ke `viewMap` mein ek nayi entry daalni hogi.

---

Bas! In steps ko follow karke aap koi bhi naya tab (jaise "Saved Items") aasani se implement kar sakte hain.