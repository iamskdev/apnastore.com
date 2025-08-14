/**
 * @file A robust module to load HTML partials/components and correctly execute their scripts.
 */

/**
 * A reusable function to load an HTML partial into a given element
 * and correctly execute any scripts within it. This is the core logic.
 * @param {HTMLElement} element - The placeholder element to inject content into.
 * @param {string} path - The path to the HTML partial file.
 */
export async function loadComponent(element, path) {
  try {
    const res = await fetch(`${path}?v=${new Date().getTime()}`); // Cache bust
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const html = await res.text();

    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = html;

    // Separate scripts from the rest of the content
    const scripts = Array.from(tempContainer.querySelectorAll('script'));
    scripts.forEach(s => s.remove());

    // Inject the HTML content without the scripts
    element.innerHTML = tempContainer.innerHTML;

    // Execute scripts sequentially and wait for them to complete
    for (const script of scripts) {
      await new Promise((resolve, reject) => {
        const newScript = document.createElement('script');
        // Copy all attributes (like type="module")
        script.getAttributeNames().forEach(attr => newScript.setAttribute(attr, script.getAttribute(attr)));
        newScript.textContent = script.textContent;
        newScript.onload = resolve;
        newScript.onerror = reject;
        element.appendChild(newScript); // Append to the element itself for better encapsulation
        if (!script.src && script.type !== 'module') resolve(); // Inline classic scripts execute synchronously
      });
    }
  } catch (err) {
    console.error(`❌ Failed to load component from: ${path}`, err);
    element.innerHTML = `<div style="color:red; padding:10px;">Failed to load ${path}.</div>`;
  }
}

/**
 * Finds all elements with a `data-partial` attribute and loads them using the loadComponent helper.
 */
export async function loadSmartPartials() {
  const appMode = window.APP_CONFIG?.appMode || null;
  // Show dev-only partials if appMode is 'dev' or 'promo'
  const allowDevOnly = appMode === 'dev' || appMode === 'promo';

  const placeholders = document.querySelectorAll('[data-partial]');
  const promises = [];

  for (const el of placeholders) {
    const path = el.dataset.partial;
    const isDevOnly = el.hasAttribute('data-devonly');

    // Skip dev-only partials if not in the correct mode
    if (isDevOnly && !allowDevOnly) {
      el.remove(); // Clean up the placeholder
      continue;
    }

    // Use the new reusable function for each partial
    promises.push(loadComponent(el, path));
  }

  // Wait for all partials to finish loading and executing their scripts
  await Promise.all(promises);
  // Dispatch a global event to notify that all initial partials are ready.
  window.dispatchEvent(new CustomEvent('partialsLoaded'));
}