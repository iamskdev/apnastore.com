// ====================================================================
// 🚀 APNA STORE - GLOBAL APP CONFIGURATION
// ====================================================================
// यह एप्लिकेशन-व्यापी सेटिंग्स के लिए सत्य का एकमात्र स्रोत है।
// ऐप के व्यवहार को बदलने के लिए इन मानों को बदलें।

(function() {
  // --- ऐप मोड लॉजिक ---
  // ऐप को चलाने के लिए मोड चुनें।
  // - "dev":   डेवलपमेंट मोड। सभी भूमिकाओं के लिए डेवलपर स्विचर दिखाई देता है।
  // - "promo": प्रमोशन मोड। एक विशिष्ट व्यापारी के लिए प्रोमोशनल UI सक्रिय करता है।
  // - null:    लाइव/प्रोडक्शन मोड। सामान्य उपयोगकर्ता प्रवाह। देव स्विचर केवल लॉग-इन सुपर-एडमिन के लिए दिखाई देता है।
  const APP_MODE = null; // <-- बदलने के लिए इस लाइन को एडिट करें: "dev", "promo", या null
  
  // --- Data Source Configuration ---
  // 'firebase':   लाइव फायरबेस डेटाबेस से डेटा प्राप्त करता है।
  // 'emulator':   स्थानीय फायरबेस एमुलेटर सूट से डेटा प्राप्त करता है (ऑफ़लाइन विकास के लिए)।
  // 'localstore': स्थानीय `/localstore/jsons/` फ़ोल्डरों से मॉक JSON डेटा प्राप्त करता है।
  const DATA_SOURCE = 'firebase'; // <-- बदलने के लिए इस लाइन को एडिट करें: 'firebase', 'emulator', or 'localstore'

  // --- NEW: Verification Flow Configuration ---
  // true:  पंजीकरण के लिए फोन OTP और ईमेल सत्यापन की आवश्यकता होगी।
  // false: उपयोगकर्ता बिना OTP या ईमेल सत्यापन के सीधे पंजीकरण कर सकते हैं।
  //        यह सेटिंग ईमेल और फोन दोनों के सत्यापन प्रवाह को नियंत्रित करती है।
  const VERIFICATION_ENABLED = true; // <-- बदलने के लिए इस लाइन को एडिट करें: true or false

  // --- NEW: Header Style Configuration ---
  // 'logo':   Shows the dynamic logo/avatar in the header. Clicking it opens the drawer.
  // 'menu':   Shows a static 3-line menu icon (hamburger menu). Clicking it opens the drawer.
  const HEADER_STYLE = 'logo'; // <-- बदलने के लिए इस लाइन को एडिट करें: 'logo' or 'menu'

  // --- ग्लोबल कॉन्फ़िगरेशन ऑब्जेक्ट ---
  // इस ऑब्जेक्ट को न बदलें।
  window.APP_CONFIG = {
    appMode: APP_MODE,
    dataSource: DATA_SOURCE,
    verificationEnabled: VERIFICATION_ENABLED,
    headerStyle: HEADER_STYLE,
  };

  // आसान डिबगिंग के लिए कंसोल में वर्तमान मोड को लॉग करें।
  if (window.APP_CONFIG.appMode) {
    console.log(`%c🚀 App Mode: ${window.APP_CONFIG.appMode.toUpperCase()}`, 'color: #448aff; font-weight: bold; font-size: 12px;');
  } else {
    console.log(`%c🚀 App Mode: PRODUCTION`, 'color: #4caf50; font-weight: bold; font-size: 12px;');
  }
  console.log(`%c💾 Data Source: ${window.APP_CONFIG.dataSource.toUpperCase()}`, 'color: #ff9800; font-weight: bold; font-size: 12px;');
  console.log(`%c🔒 Verification Flow: ${window.APP_CONFIG.verificationEnabled ? 'ENABLED' : 'DISABLED'}`, 'color: #e91e63; font-weight: bold; font-size: 12px;');
  console.log(`%c🎨 Header Style: ${window.APP_CONFIG.headerStyle.toUpperCase()}`, 'color: #9c27b0; font-weight: bold; font-size: 12px;');
})();