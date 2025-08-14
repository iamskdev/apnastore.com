
import { createItemCard } from '/src/components/card/card.js';
import { fetchAllItems, fetchActivePromotion } from '/src/utils/data-manager.js';
import { showToast } from '/src/utils/toast.js';

/**
 * Shows the full-screen loader.
 */
function showFullScreenLoader() {
  const loader = document.getElementById('full-screen-loader');
  if (loader) loader.classList.remove('hidden');
}

/**
 * Hides the full-screen loader.
 */
function hideFullScreenLoader() {
  const loader = document.getElementById('full-screen-loader');
  if (loader) loader.classList.add('hidden');
}

/**
 * Displays search results in the dedicated search results view.
 * @param {Array<object>} results - An array of item objects to display.
 * @param {string} query - The search query that was used.
 */
async function displayDedicatedSearchResults(results, query) {
  const listEl = document.getElementById('search-results-list');
  const queryEl = document.getElementById('search-query-display');
  if (!listEl || !queryEl) return;

  queryEl.textContent = query;
  listEl.innerHTML = ''; // Clear previous results

  if (results.length === 0) {
    listEl.innerHTML = `<div class="no-results">No results found for "${query}"</div>`;
    return;
  }

  for (const item of results) {
    const card = await createItemCard(item, 'search');
    listEl.appendChild(card);
  }
}


import { initializeSearch } from '/src/utils/search-handler.js';
import { initializeItemDetailsPage, handleNavigateToItem } from '/src/common/scripts/item-details.js';
import { viewManager } from '/src/utils/view-manager.js';
import { initializePwaInstall } from '/src/utils/pwa-install-handler.js';

/**
 * Handles URL parameters on initial app load to show a specific view or search result.
 * @param {Fuse} fuseInstance - The initialized Fuse.js instance for performing searches.
 */
function handleUrlParameters(fuseInstance) {
  const urlParams = new URLSearchParams(window.location.search);
  // This function is now simplified. The hash-based navigation in view-manager.js
  // is the primary way to handle initial views. This can be used for other URL params later.
  console.log("Handling URL parameters if any...");
}

// Listen for the navigateToItem event
window.addEventListener('navigateToItem', handleNavigateToItem);

// Listen for navigation requests from dynamically loaded views
window.addEventListener('requestViewChange', (e) => {
  const { role, view } = e.detail;
  if (viewManager.viewConfig[role]?.[view]) {
    viewManager.switchView(role, view);
  } else {
    console.warn(`View change request for a non-existent view was ignored: ${role}/${view}`);
  }
});

// Main application initialization function
async function initializeApp() {
  console.log("🚀 🚀 Initializing App...");
  showFullScreenLoader();
  
  // 1. Initialize the View Manager first. This sets up the core navigation.
  viewManager.init();

  // NEW: Initialize PWA install logic centrally.
  initializePwaInstall();

  // Set up ResizeObservers to automatically adjust layout variables.
  initializeLayoutObservers();

  try {
    // 2. Fetch all data using the centralized data service.
    // FIX: The fetchAllItems function returns an array directly, not an object.
    // Using destructuring `{ allItems }` was causing `allItems` to be undefined.
    const allItems = await fetchAllItems();
    // Store the full list in sessionStorage for all pages (unified)
    sessionStorage.setItem('allItems', JSON.stringify(allItems));

    // 3. Initialize data-dependent modules
    const fuseInstance = initializeSearch(allItems);
    initializeExploreView(allItems.filter(i => i.type === 'product'), allItems.filter(i => i.type === 'service'));

    // 4. Handle special app modes like 'promo'
    if (window.APP_CONFIG.appMode === 'promo') {
        const promotionData = await fetchActivePromotion();
        if (promotionData) {
            console.log('🎉 Promotion Activated:', promotionData);
            window.dispatchEvent(new CustomEvent('promotionActivated', { detail: promotionData }));
        }
    }

    // 5. Check for and handle any incoming URL parameters
    handleUrlParameters(fuseInstance);

  } catch (error) {
    console.error("❌ Failed to load item data:", error);
    showToast('error', 'Failed to load app data. Please refresh.', 5000);
    // Dispatch an event to notify the explore view of the error.
    window.dispatchEvent(new CustomEvent('itemDataLoadError', {
      detail: { message: "Failed to load items. Please try again later." }
    }));
    // The explore view will handle displaying the error message.
  } finally {
    // A small delay to make the transition smoother and prevent jarring flashes
    // Hide the loader regardless of success or failure.
    setTimeout(hideFullScreenLoader, 300);
  }

  // 6. Initialize cart and saved items in sessionStorage if they don't exist
  if (!sessionStorage.getItem('cart')) {
    sessionStorage.setItem('cart', '[]');
  }
  if (!sessionStorage.getItem('savedItems')) {
    sessionStorage.setItem('savedItems', '[]');
  }
}

/**
 * Sets up ResizeObservers to dynamically update layout CSS variables (--header-height, --bottom-height)
 * whenever the header or bottom navigation bar changes size. This is more efficient and reliable
 * than using window.resize or custom events, as it reacts to content changes (like banners).
 */
function initializeLayoutObservers() {
  const header = document.querySelector('.header-container');
  const bottomBar = document.querySelector('.bottom-tab-bar');

  const observer = new ResizeObserver(entries => {
    for (let entry of entries) {
      const height = entry.contentRect.height;
      if (entry.target.matches('.header-container')) {
        document.documentElement.style.setProperty('--header-height', `${height}px`);
      } else if (entry.target.matches('.bottom-tab-bar')) {
        document.documentElement.style.setProperty('--bottom-height', `${height}px`);
      }
    }
  });

  if (header) observer.observe(header);
  if (bottomBar) observer.observe(bottomBar);
}

/* app intialization */
initializeApp();