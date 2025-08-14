/**
 * @file Manages all logic related to the Progressive Web App (PWA) installation flow.
 * This includes listening for the `beforeinstallprompt` event, showing custom UI,
 * and handling the user's installation choice.
 */

import { showToast } from '/src/utils/toast.js';

/**
 * Sets up the PWA installation button and its logic.
 * This is the central place for PWA install handling.
 */
export function initializePwaInstall() {
  const headerInstallBtn = document.getElementById('pwa-install-btn');
  const drawerContainer = document.getElementById('app-drawer');

  // Guard clause if no buttons are found
  if (!headerInstallBtn && !drawerContainer) {
    console.warn('PWA install button or drawer container not found in the DOM.');
    return;
  }

  let deferredPrompt;

  // Hide all PWA install buttons by default.
  if (headerInstallBtn) headerInstallBtn.style.display = 'none';
  // The drawer buttons are hidden via the 'hidden' class in their HTML.
  // This script will remove the class when the app is installable.

  // Check if the app is already running in standalone mode (installed).
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('PWA is already running in standalone mode. Install prompt will not be shown.');
    return; // No need to set up install listeners if already installed.
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('`beforeinstallprompt` event was fired.');

    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to notify the user they can install the PWA.
    // This makes all install buttons (header, drawer) visible.
    console.log('PWA is now installable. Showing all install buttons.');
    if (headerInstallBtn) headerInstallBtn.style.display = 'flex';
    document.querySelectorAll('.drawer-install-btn').forEach(btn => btn.classList.remove('hidden'));
  });

  /**
   * A helper function to show the PWA install modal with a smooth transition.
   * @param {HTMLElement} modal - The modal element.
   * @param {HTMLElement} overlay - The overlay element.
   */
  const showInstallModal = (modal, overlay) => {
    modal.style.display = 'block';
    overlay.style.display = 'block';
    // Use requestAnimationFrame to ensure the display property is applied before adding the class for the transition.
    requestAnimationFrame(() => {
      modal.classList.add('visible');
      overlay.classList.add('visible');
    });
  };

  /**
   * A helper function to hide the PWA install modal and wait for the transition to finish.
   * @param {HTMLElement} modal - The modal element.
   * @param {HTMLElement} overlay - The overlay element.
   */
  const hideInstallModal = (modal, overlay) => new Promise(resolve => {
    modal.addEventListener('transitionend', () => {
      modal.style.display = 'none';
      overlay.style.display = 'none';
      resolve();
    }, { once: true }); // The listener will automatically remove itself after firing once.
    modal.classList.remove('visible');
    overlay.classList.remove('visible');
  });

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Provide more specific feedback to the user.
      // The most common reason for failure is not being on a secure (HTTPS) context.
      if (!window.isSecureContext) {
        showToast('error', 'Installation requires a secure (HTTPS) connection. Check the URL bar for a 🔒 icon.', 5000);
      } else {
        showToast('info', 'App is not installable right now. It might be already installed or the browser needs a refresh.', 5000);
      }
      return;
    }

    // Show the custom modal instead of directly prompting
    // The modal is defined in header.html and is globally available.
    const modal = document.getElementById('pwa-install-modal');
    const overlay = document.getElementById('pwa-install-overlay');
    const cancelBtn = document.getElementById('pwa-modal-cancel-btn');
    const confirmBtn = document.getElementById('pwa-modal-confirm-btn');

    if (!modal || !overlay || !cancelBtn || !confirmBtn) {
        console.error('PWA install modal elements not found. Prompting directly as a fallback.');
        // Hide buttons before showing the native prompt.
        if (headerInstallBtn) headerInstallBtn.style.display = 'none';
        document.querySelectorAll('.drawer-install-btn').forEach(btn => btn.classList.add('hidden'));
        deferredPrompt.prompt(); // Fallback to direct prompt
        return;
    }

    showInstallModal(modal, overlay);

    const userChoice = await new Promise(resolve => {
      cancelBtn.onclick = () => resolve('dismissed');
      confirmBtn.onclick = () => resolve('accepted');
    });

    // Hide the modal and wait for the animation to complete before proceeding.
    await hideInstallModal(modal, overlay);

    if (userChoice === 'accepted') {
      // Hide buttons after user accepts the custom modal and before the native prompt is shown.
      if (headerInstallBtn) headerInstallBtn.style.display = 'none';
      document.querySelectorAll('.drawer-install-btn').forEach(btn => btn.classList.add('hidden'));
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      deferredPrompt = null;
    } else {
      console.log('User dismissed the custom PWA install modal.');
      // The deferredPrompt is still valid, so we do nothing and leave the button visible.
    }
  };

  if (headerInstallBtn) headerInstallBtn.addEventListener('click', handleInstallClick);

  // Use a single, delegated event listener for all drawer install buttons.
  if (drawerContainer) {
    drawerContainer.addEventListener('click', (event) => {
      const installBtn = event.target.closest('.drawer-install-btn');
      if (installBtn) {
        handleInstallClick();
      }
    });
  }

  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed successfully.');
    if (headerInstallBtn) headerInstallBtn.style.display = 'none';
    document.querySelectorAll('.drawer-install-btn').forEach(btn => btn.classList.add('hidden'));
    deferredPrompt = null;
  });
}