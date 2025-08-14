/**
 * @file Centralized Theme Management
 * This module provides functions to get and set the application's theme,
 * ensuring consistency across all components.
 */

/**
 * Applies the specified theme to the application.
 * @param {string} theme - The theme to set ('light' or 'dark').
 */
export function setTheme(theme) {
  const root = document.documentElement;
  const isDark = theme === 'dark';

  // 1. Update localStorage to remember the user's choice
  localStorage.setItem('app-theme', theme);

  // 2. Update the class on the <html> element to apply CSS variables
  // A more robust method: remove both classes, then add the correct one.
  root.classList.remove('dark-mode', 'light-mode');
  root.classList.add(`${theme}-mode`);

  // 3. Update the data-theme attribute for any other potential uses
  root.dataset.theme = theme;

  // 4. Dispatch a custom event to notify other components (like the drawer toggles)
  window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
}

/**
 * Gets the currently active theme from localStorage or system preference.
 * @returns {string} The current theme ('light' or 'dark').
 */
export function getCurrentTheme() {
  return localStorage.getItem('app-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}