# 🧭 Navigation Tabs and Feature Status

This document provides a complete overview of all navigation tabs and features for each user role, along with their current implementation status.

---

## 👤 Guest & 👨 User Roles

These two roles share the same set of 5 bottom navigation tabs, but the functionality might differ (e.g., the Account tab).

| Tab Name  | Mapped View      | Status                      | Pending Work                                                              |
|-----------|------------------|-----------------------------|---------------------------------------------------------------------------|
| **Home**  | `home-view`      | ✅ Implemented              | Currently shows a welcome message. Can be enhanced later.                 |
| **Explore**| `explore-view`   | ✅ Implemented              | Products/Services tabs, categories, and item grid work.                   |
| **Saved** | `saved-view`     | 🟡 **Partially Implemented** | Renders saved items in a grid. UI needs refinement & save/unsave logic.   |
| **Cart**  | `cart-view`      | 🟡 **Partially Implemented** | Renders cart items in a grid. Needs quantity controls, totals, & checkout flow. |
| **Account**| `account-view`   | ✅ Implemented              | Shows a "Login/Sign Up" prompt for guests.                                |

**Drawer Items (Pending):**
- All items in the Guest and User drawer (like Support, Settings, Orders, etc.) are currently UI placeholders and need functionality.

---

## ⚙️ Admin Role

**Total Bottom Navigation Tabs: 5**

| Tab Name      | Mapped View      | Status             | Pending Work                                                                  |
|---------------|------------------|--------------------|-------------------------------------------------------------------------------|
| **Dashboard** | `home-view`      | 🟡 **Placeholder** | Currently shows the user home view. Needs a dedicated dashboard UI with stats.     |
| **Inventory** | `explore-view`   | 🟡 **Placeholder** | Currently shows user products. Needs an admin-specific inventory management UI.   |
| **Analytics** | `saved-view`     | 🟡 **Placeholder** | Currently shows the user saved view. Needs charts and data visualization.       |
| **Requests**  | `cart-view`      | 🟡 **Placeholder** | Currently shows the user cart view. Needs a UI to manage user requests/orders.    |
| **Account**   | `account-view`   | ✅ Implemented     | Shows a basic "My Account" placeholder for logged-in users.                   |

**Drawer Items (Pending):**
- All items in the Admin drawer (like Shop Profile, Units, Suppliers, etc.) are currently UI placeholders and need functionality.

---

## 💻 Developer Role

**Total Bottom Navigation Tabs: 5**

| Tab Name     | Status                               | Notes                                           |
|--------------|--------------------------------------|-------------------------------------------------|
| **Home**     | ✅ Implemented (Link)                | Links to `dev-home.html`.                       |
| **Mock**     | ✅ Implemented (Link)                | Links to `mock-tools.html`.                     |
| **Logs**     | ✅ Implemented (Link)                | Links to `log-viewer.html`.                     |
| **Preview**  | ✅ Implemented (Link)                | Links to `ui-preview.html`.                     |
| **Settings** | ✅ Implemented (Link)                | Links to `config-panel.html`.                   |

**Drawer Items (Pending):**
- All items in the Dev drawer are currently UI placeholders and need functionality.

---

## 🚀 Naye Tabs Implement Karne Ke Liye Zaroori Baatein (Future Guide)

Jab bhi aap koi naya tab ya feature jodenge, toh in baaton ka dhyaan rakhein. Hamare project mein do tarah ke navigation patterns hain:

### Pattern 1: Single Page Application (SPA) Views (Guest, User, Admin ke liye)

Yeh roles `index.html` ke andar alag-alag `<div>` views ko dikhate aur chhipate hain.

1.  **HTML View Banayein:** `index.html` mein, ek naya `<div id="new-view-id" class="page-view hidden">...</div>` banayein.
2.  **JavaScript Logic Likhein:** `public/scripts/views/` folder mein ek nayi file (`new-view.js`) banayein aur usmein `initializeNewView()` jaisa function likhein.
3.  **Logic ko Load Karein:** `main-script.js` mein, nayi file ko `import` karein aur `initializeApp()` ke andar uske function ko call karein.
4.  **Navigation Jodein:** `bottom-nav.html` mein:
    *   Sahi role ke liye ek naya `<div class="nav-item" data-tab="new-tab">...</div>` jodein.
    *   Script ke andar `viewMap` object mein nayi entry daalein: `'new-tab': 'new-view-id'`.

### Pattern 2: Alag HTML Pages (Developer ke liye)

Developer role seedhe alag-alag HTML pages par link karta hai.

1.  **HTML Page Banayein:** `developer/pages/` folder mein ek nayi HTML file (`new-tool.html`) banayein.
2.  **Navigation Jodein:** `bottom-nav.html` mein, seedhe ek naya link jodein: `<a href="/src/modules/admin/pages/new-tool.html" class="nav-item dev-only">...</a>`. Iske liye `viewMap` mein badlaav ki zaroorat nahi hai.

> **Zaroori Tip:** Hamesha koshish karein ki har naye view ka logic uski apni JavaScript file mein hi rahe. Isse code saaf-suthra aur manage karne mein aasan rehta hai.

---

## 📝 Summary of Pending Work

1.  **Saved Items Feature:**
    -   Design the UI for the "Saved" page.
    -   Implement logic to save/unsave items (likely using `localStorage`).
    -   Render saved items on the page.

2.  **Shopping Cart Feature:**
    -   Design the UI for the "Cart" page.
    -   Implement logic to add/remove items and update quantities.
    -   Calculate totals and create a checkout flow.

3.  **Admin Panel Views:**
    -   Create dedicated UIs for Dashboard, Inventory, Analytics, and Requests.
    -   This will be a major part of the project once Firebase is integrated.

4.  **Drawer Functionality:**
    -   Implement the logic for each drawer item, such as:
        -   Theme (Light/Dark mode) switcher.
        -   Language switcher.
        -   Logout functionality.
        -   Links to other pages (Settings, Support, etc.).