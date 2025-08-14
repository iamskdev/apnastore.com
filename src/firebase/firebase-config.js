import { showToast } from '/src/utils/toast.js';

// Firebase config (NO import statements, use global firebase object from CDN)
const firebaseConfig = {
  apiKey: "AIzaSyC_kNV6YKWRCJQG-DJB2E9s5goETiGpfmM",
  authDomain: "ms-eco-pro.firebaseapp.com",
  projectId: "ms-eco-pro",
  storageBucket: "ms-eco-pro.appspot.com",
  messagingSenderId: "880605995333",
  appId: "1:880605995333:web:02433a254347fd09bdde2c",
  measurementId: "G-TEGCGCXHMR"
};

try {
  // Initialize Firebase (only once, browser compatible)
  window._firebaseApp = window._firebaseApp || firebase.initializeApp(firebaseConfig);
  window._firestore = window._firestore || firebase.firestore();
  window._auth = window._auth || firebase.auth();
  window._functions = window._functions || firebase.functions();
  console.log("🔥 Firebase services initialized successfully.");

  // --- Emulator Suite Connection ---
  // If the app config specifies 'emulator', connect to the local emulators.
  // This allows for rapid, offline, and cost-free development and testing.
  // IMPORTANT: Run `firebase emulators:start` in your terminal before running the app.
  if (window.APP_CONFIG?.dataSource === 'emulator') {
    console.warn("🔌 App is configured to use EMULATOR data source. Connecting to local Firebase Emulators...");
    // Note: The host for firestore is just 'localhost', not a full URL.
    window._firestore.useEmulator('localhost', 8080); 
    window._auth.useEmulator('http://localhost:9099');
    window._functions.useEmulator('localhost', 5001);
    console.log("✅ Connected to local Firestore, Auth, and Functions emulators.");
    showToast('info', '⚡️ Emulator Mode: Connected to local Firebase.', 6000);    

    // --- Hide Emulator UI Bar (Aggressive Polling Method) ---
    // This method repeatedly checks for the emulator bar and hides it.
    // It's a robust solution for the race condition where the bar is injected unpredictably.
    let attempts = 0;
    const maxAttempts = 100; // Try for 5 seconds (100 * 50ms)
    const hideInterval = setInterval(() => {
        const emulatorBar = document.getElementById('firebase-emulator-container');
        if (emulatorBar) {
            emulatorBar.style.setProperty('display', 'none', 'important');
            console.log(`✅ Firebase Emulator UI bar hidden after ${attempts + 1} attempts.`);
            clearInterval(hideInterval);
        } else if (attempts++ > maxAttempts) {
            console.warn('Could not find emulator bar to hide after 5 seconds.');
            clearInterval(hideInterval);
        }
    }, 50); // Check every 50ms
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
}