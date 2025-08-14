/**
 * @file View Manager
 * This module is the single source of truth for managing application views.
 * It handles view configuration, switching, content loading, and URL hash synchronization.
 */

// --- View Configuration ---
// Defines all possible views for each user role, their DOM IDs, and content paths.
// This
const viewConfig = {
    guest: {
        home: { id: 'guest-home-view', path: null, showFilterBar: true, embedFooter: true },
        explore: { id: 'guest-explore-view', path: null, showFilterBar: true },
        saved: { id: 'guest-saved-view', path: null },
        cart: { id: 'guest-cart-view', path: null },
        account: { 
            id: 'guest-account-view', 
            path: '/src/common/pages/guest-account.html', 
            cssPath: '/src/common/styles/guest-account.css',
            jsPath: '/src/common/scripts/guest-account.js' // This line was missing a comma
           }
    },
    user: {
        home: { 
            id: 'user-home-view',
            path: '/src/modules/consumer/pages/user-home.html',
            cssPath: '/src/modules/consumer/styles/user-home.css', // Explicitly define the correct CSS path
            jsPath: '/src/modules/consumer/scripts/user-home.js', // Explicitly define the correct JS path
            showFilterBar: true,
            embedFooter: true  // Embed it directly into the view content
        },
        explore: { id: 'user-explore-view', path: null, showFilterBar: true },
        saved: { id: 'user-saved-view', path: null },
        cart: { id: 'user-cart-view', path: null },
        account: { id: 'user-account-view', path: null }
    },
    merchant: {
        home: { id: 'merchant-home-view', path: null, embedFooter: true },
        explore: { id: 'merchant-inventory-view', path: null },
        add: { id: 'merchant-add-view', path: null },
        analytics: { id: 'merchant-analytics-view', path: null },
        account: { id: 'merchant-account-view', path: null }
    },
    admin: {
        home: { id: 'admin-home-view', path: "src/modules/admin/pages/admin-home.html", showFooter: false, embedFooter: true },
        data: { id: 'admin-data-view', path: null },
        logs: { id: 'admin-logs-view', path: null },
        promo: { id: 'admin-promo-view', path: null },
        account: { id: 'admin-account-view', path: null }
    }
};

// NEW: Define the default "landing" view for each role.
// This makes the logic cleaner and easier to manage.
const defaultViews = {
    guest: 'home',
    user: 'home',
    merchant: 'add',
    admin: 'home'
};

class ViewManager {
    constructor() {
        this.currentRole = 'guest';
        this.currentView = 'home';
        this.viewConfig = viewConfig; // Expose config if needed externally
        this.defaultViews = defaultViews;
        this.loadedViews = new Set();
        this.filterManager = null; // To be lazy-loaded
        this.footerHelper = null; // To be lazy-loaded for managing the footer
        this.subscribers = [];
    }

    /**
     * Allows components to subscribe to view changes.
     * The callback is immediately invoked with the current state, eliminating race conditions.
     * @param {function} callback - The function to call with the new state {role, view}.
     */
    subscribe(callback) {
        if (typeof callback === 'function') {
            this.subscribers.push(callback);
            // Immediately notify the new subscriber with the current, complete state.
            const config = this.viewConfig[this.currentRole]?.[this.currentView] || {};
            callback({
                role: this.currentRole,
                view: this.currentView,
                config: config
            });
        }
    }

    /** @private Notifies all subscribers about a state change. */
    _notifySubscribers() {
        const config = this.viewConfig[this.currentRole]?.[this.currentView] || {};
        const state = { role: this.currentRole, view: this.currentView, config: config };
        this.subscribers.forEach(callback => callback(state));
    }

    /** 
     * @private Loads and embeds the footer into a view element, then initializes its logic.
     * This helper centralizes the logic for both path-based and pathless views.
     * @param {HTMLElement} viewElement - The view container element.
     * @param {string} [existingHtml=''] - The existing HTML content of the view to prepend.
     */
    async _loadAndEmbedFooter(viewElement, role, existingHtml = '') {
        try {
            const footerResponse = await fetch('/src/components/footer.html');
            if (!footerResponse.ok) throw new Error('Footer HTML not found');
            
            const footerHtml = await footerResponse.text();
            // NEW: Wrap content in a div that can grow, ensuring the footer is pushed down.
            viewElement.innerHTML = `<div class="view-content-wrapper">${existingHtml}</div>` + footerHtml;
            viewElement.classList.add('has-embedded-footer'); // Add class for CSS layout targeting

            // Lazy-load and initialize footer logic
            if (!this.footerHelper) {
                const { initializeFooter } = await import('/src/utils/footer-helper.js');
                this.footerHelper = { initialize: initializeFooter };
            }
            this.footerHelper.initialize(viewElement, role);
        } catch (e) {
            console.warn(`ViewManager: Could not embed footer for ${viewElement.id}`, e);
        }
    }

    /**
     * Switches the active view with a transition.
     * @param {string} role The user role for the view.
     * @param {string} viewId The ID of the view to switch to.
     */
    async switchView(role, viewId) {
        // Validate the requested role and viewId. Fallback to a safe default if invalid.
        if (!this.viewConfig[role] || !this.viewConfig[role][viewId]) {
            console.warn(`ViewManager: Invalid role "${role}" or view "${viewId}". Falling back to default.`);
            role = 'guest'; // Safe fallback role
            viewId = this.defaultViews[role];
        }

        const config = this.viewConfig[role][viewId];
        const currentViewElement = document.querySelector('.view-container.view-active');
        const newViewElement = document.getElementById(config.id);

        if (!newViewElement) {
            console.error(`View element not found in DOM: #${config.id}`);
            return;
        }
        
        // If the requested view is already active, we don't need to re-render it.
        // However, we MUST re-dispatch the 'viewChanged' event. This allows components
        // within that view (like the auth form) to reset their state based on a new
        // user action (e.g., clicking 'Login' in the drawer).
        if (currentViewElement === newViewElement) {
            this._notifySubscribers(); // Re-notify for state resets
            return;
        }

        if (currentViewElement) currentViewElement.classList.remove('view-active');

        if (config.path && !this.loadedViews.has(config.id)) {
            await this.loadViewContent(newViewElement, config, role);
        }

        // Handle embedding the footer for views that don't have a content path but need a footer.
        // This ensures views like guest-home can have a footer without a dedicated HTML file.
        if (!config.path && config.embedFooter && !this.loadedViews.has(config.id)) {
            await this._loadAndEmbedFooter(newViewElement, role);
            this.loadedViews.add(config.id); // Mark as "loaded" to prevent re-embedding
        }

        newViewElement.classList.add('view-active');
        this.currentRole = role;
        this.currentView = viewId;

        // --- Manage Shared UI Components ---

        // 1. Manage the filter bar based on the new view's config
        if (!this.filterManager) {
            // Lazy-load the filter manager on first use to keep initial load light.
            const { filterManager } = await import('/src/utils/filter-helper.js');
            this.filterManager = filterManager;
        }
        this.filterManager.manageVisibility(config.showFilterBar || false);

        history.replaceState({ role, view: viewId }, '', `#${role}/${viewId}`);
        
        this._notifySubscribers();
    }

    async loadViewContent(viewElement, config, role) {
        try {
            viewElement.innerHTML = `<div class="view-placeholder"><div class="loading-spinner"><div class="spinner"></div></div></div>`;

            // 1. Load associated CSS file if it exists and isn't already loaded.
            // Use specific cssPath from config, or fall back to convention for other views.
            const cssPath = config.cssPath || config.path.replace('.html', '.css');
            console.log(`ViewManager: Attempting to load CSS from: ${cssPath}`);
            if (!document.querySelector(`link[href="${cssPath}"]`)) {
                // Check if the CSS file actually exists before adding the link tag
                const cssCheck = await fetch(cssPath, { method: 'HEAD' });
                if (cssCheck.ok) {
                    const cssLink = document.createElement('link');
                    cssLink.rel = 'stylesheet';
                    cssLink.href = cssPath;
                    cssLink.id = `${config.id}-style`; // Give it an ID for potential removal later
                    document.head.appendChild(cssLink);
                    console.log(`ViewManager: Successfully appended CSS: ${cssPath}`);
                } else {
                    console.warn(`ViewManager: CSS file not found or accessible: ${cssPath}. Status: ${cssCheck.status}`);
                }
            } else {
                console.log(`ViewManager: CSS already loaded: ${cssPath}`);
            }

            // 2. Fetch and inject HTML content
            const htmlResponse = await fetch(config.path);
            if (!htmlResponse.ok) throw new Error(`HTML fetch failed: ${htmlResponse.status}`);
            let viewHtml = await htmlResponse.text();

            // If the view config requests an embedded footer, fetch and append it.
            // This is used for views where the footer should be part of the scrollable content.
            if (config.embedFooter) {
                await this._loadAndEmbedFooter(viewElement, role, viewHtml);
            }
            else {
                // Also wrap non-footer views for consistency, though it has less impact.
                viewElement.innerHTML = `<div class="view-content-wrapper">${viewHtml}</div>`;
            }
            console.log(`ViewManager: Successfully loaded content for ${config.id} from ${config.path}`);

            // If the view has an embedded footer, initialize its interactive logic.
            if (config.embedFooter) {
                try {
                    // The initialization is now handled inside _loadAndEmbedFooter
                } catch (e) {
                    console.error(`ViewManager: Failed to initialize embedded footer for ${config.id}`, e);
                }
            }

            // 3. Load and execute associated JS module if it exists.
            // Use specific jsPath from config, or fall back to convention.
            const jsPath = config.jsPath || config.path.replace('.html', '.js');
            console.log(`ViewManager: Attempting to load JS from: ${jsPath}`);

            try {
                console.log(`ViewManager: Importing module from: ${jsPath}?v=${new Date().getTime()}`);
                const module = await import(`${jsPath}?v=${new Date().getTime()}`);
                if (module.init && typeof module.init === 'function') {
                    console.log(`ViewManager: Calling init() for ${config.id}`);
                    module.init();
                    console.log(`ViewManager: Successfully initialized JS for ${config.id}`);
                } else {
                    console.warn(`ViewManager: init() function not found or not a function in ${config.id} at ${jsPath}.`);
                }
            } catch (e) {
                // It's okay if a JS file doesn't exist for a simple view.
                // We only log an error if the import failed for a reason other than "not found".
                if (!e.message.includes('Failed to fetch') && !e.message.includes('404')) {
                    console.error(`Error executing script for ${config.id} at ${jsPath}:`, e);
                } else {
                    console.warn(`ViewManager: JS file not found for ${config.id} at ${jsPath}. This might be expected for simple views.`);
                }
            }

            this.loadedViews.add(config.id);
        } catch (err) {
            console.error(`Failed to load view content for ${config.id}:`, err);
            viewElement.innerHTML = `<div class="view-error"><h3>Failed to load content</h3><p>${err.message}</p></div>`;
        }
    }

    handleRoleChange(newRole) {
        // Centralize state change: ViewManager is responsible for this localStorage item.
        localStorage.setItem('currentUserType', newRole);
        // If switching to guest, ensure the user ID is also cleared.
        if (newRole === 'guest') {
            localStorage.removeItem('currentUserId');
        }

        // Get the default view for the new role from our config object.
        const defaultView = this.defaultViews[newRole] || 'home';
        this.switchView(newRole, defaultView);
    }

    init() {
        const savedRole = localStorage.getItem('currentUserType');
        const hash = window.location.hash.substring(1);
        const [hashRole, hashView] = hash.split('/');

        // Authoritative role determination:
        // 1. Prioritize the role saved in localStorage. This represents the current logged-in state.
        // 2. If no role is saved, check the URL hash for deep-linking.
        // 3. If neither is present or valid, default to 'guest'.
        let initialRole = 'guest';
        if (savedRole && this.viewConfig[savedRole]) {
            initialRole = savedRole;
        } else if (hashRole && this.viewConfig[hashRole]) {
            initialRole = hashRole;
        }

        // Determine the initial view. If the role came from storage, the hash view is likely stale,
        // so we use the default view for the role. Otherwise, we can trust the hash.
        const initialView = (initialRole === hashRole && hashView && this.viewConfig[initialRole]?.[hashView])
            ? hashView
            : (this.defaultViews[initialRole] || 'home');
      
        // Switch to the initial view.
        this.switchView(initialRole, initialView);

        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.role && e.state.view) { this.switchView(e.state.role, e.state.view); }
        });
        console.log("👁️ View Manager Initialized.");
    }
}

export const viewManager = new ViewManager();