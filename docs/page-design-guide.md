> **DOCUMENT AUDIT**
> - **Status:** `Active & Essential`
> - **Last Reviewed:** August 11, 2025, 11:15 PM IST
> - **Reviewer:** Gemini
> - **Purpose:** This document provides a mandatory guide for developers on how to create new pages and views within the "Apna Store" project, ensuring consistency, performance, and adherence to the established architecture.

---

# 📖 नए पेज और व्यू बनाने के लिए गाइड

यह गाइड "अपना स्टोर" प्रोजेक्ट में एक नया पेज या व्यू बनाने की प्रक्रिया का विवरण देता है। एक सुसंगत और रखरखाव योग्य कोडबेस बनाए रखने के लिए इन चरणों का पालन करना अनिवार्य है।

## 🎯 मुख्य सिद्धांत (Core Principles)

1.  **मॉड्यूलरिटी (Modularity):** प्रत्येक पेज को एक आत्मनिर्भर मॉड्यूल के रूप में माना जाना चाहिए, जिसकी अपनी HTML, CSS, और JS फाइलें हों।
2.  **केंद्रीकृत स्टेट मैनेजमेंट (Centralized State Management):** सभी व्यू ट्रांज़िशन और भूमिका परिवर्तन को **`view-manager.js`** द्वारा नियंत्रित किया जाना चाहिए। सीधे DOM में हेरफेर करके व्यू को न दिखाएँ या छिपाएँ।
3.  **डेटा एब्स्ट्रैक्शन (Data Abstraction):** फायरस्टोर से सीधे डेटा प्राप्त करने के बजाय हमेशा **`data-manager.js`** में मौजूद फंक्शन्स (जैसे `fetchItemById`, `fetchAllUsers`) का उपयोग करें।
4.  **पुन: प्रयोज्यता (Reusability):** नए कंपोनेंट्स बनाने से पहले, देखें कि क्या `src/components/` में कोई मौजूदा कंपोनेंट (जैसे `card.js`) आपकी आवश्यकता को पूरा कर सकता है।

---

## 🚀 एक नया पेज बनाने के चरण (Steps to Create a New Page)

मान लीजिए कि हम एक व्यापारी के लिए एक नया "प्रोफाइल एडिट" पेज बना रहे हैं।

### चरण 1: फ़ाइल संरचना (File Structure)

सही डायरेक्टरी में आवश्यक फाइलें बनाएँ।

```
src/
└── modules/
    └── merchant/
        ├── pages/
        │   └── merchant-profile-edit.html  <-- (नई HTML)
        ├── scripts/
        │   └── merchant-profile-edit.js    <-- (नई JS)
        └── styles/
            └── merchant-profile-edit.css   <-- (नई CSS)
```

### चरण 2: व्यू को कॉन्फ़िगर करें (`view-manager.js`)

`src/utils/view-manager.js` खोलें और `viewConfig` ऑब्जेक्ट में अपने नए व्यू के लिए एक एंट्री जोड़ें।

```javascript
const viewConfig = {
    // ... other roles
    merchant: {
        // ... other merchant views
        'profile-edit': { // <-- नया व्यू
            id: 'merchant-profile-edit-view', // DOM में संबंधित div की ID
            path: '/src/modules/merchant/pages/merchant-profile-edit.html',
            // JS और CSS पथ वैकल्पिक हैं, लेकिन अनुशंसित हैं
            jsPath: '/src/modules/merchant/scripts/merchant-profile-edit.js',
            cssPath: '/src/modules/merchant/styles/merchant-profile-edit.css',
            embedFooter: false // इस पेज पर फुटर की आवश्यकता नहीं है
        }
    }
    // ... other roles
};
```

### चरण 3: व्यू कंटेनर बनाएँ (`index.html`)

`index.html` में, संबंधित भूमिका के सेक्शन के अंदर अपने नए व्यू के लिए एक `div` कंटेनर जोड़ें। `id` `viewConfig` में आपके द्वारा परिभाषित `id` से मेल खाना चाहिए।

```html
<!-- Merchant Views -->
<div id="merchant-home-view" class="view-container" data-view="home" data-role="merchant"></div>
<!-- ... other merchant views ... -->
<div id="merchant-profile-edit-view" class="view-container" data-view="profile-edit" data-role="merchant"></div>
```

### चरण 4: पेज का लॉजिक लिखें (JS फाइल)

अपनी नई `.js` फ़ाइल (`merchant-profile-edit.js`) में, एक `init()` फ़ंक्शन बनाएँ। `view-manager` इस फ़ंक्शन को स्वचालित रूप से कॉल करेगा जब आपका पेज पहली बार लोड होगा।

```javascript
import { fetchMerchantById } from '/src/utils/data-manager.js';
import { showToast } from '/src/utils/toast.js';

export function init() {
    const view = document.getElementById('merchant-profile-edit-view');
    if (view.dataset.initialized) return; // दोबारा शुरू होने से रोकें

    console.log('Initializing Merchant Profile Edit page...');

    // यहाँ अपना लॉजिक लिखें:
    // 1. DOM एलिमेंट्स प्राप्त करें (जैसे, फॉर्म, इनपुट)
    // 2. डेटा-मैनेजर का उपयोग करके आवश्यक डेटा प्राप्त करें
    // 3. इवेंट लिसनर्स जोड़ें (जैसे, 'submit' या 'click')

    view.dataset.initialized = 'true';
}
```

### चरण 5: नेविगेशन को ट्रिगर करें

किसी अन्य पेज (जैसे, `merchant-account.html`) से, आप एक बटन या लिंक पर एक इवेंट लिसनर जोड़ सकते हैं जो `viewManager` को आपके नए पेज पर स्विच करने के लिए कहेगा।

```javascript
// उदाहरण: merchant-account.js में
const editProfileBtn = document.getElementById('edit-profile-btn');
editProfileBtn.addEventListener('click', () => {
    // सीधे viewManager को कॉल करें
    viewManager.switchView('merchant', 'profile-edit');
});
```

---

## ✅ चेकलिस्ट और सर्वोत्तम प्रथाएँ

-   **क्या आपने `viewConfig` को अपडेट किया है?** यह सबसे महत्वपूर्ण कदम है।
-   **क्या आपने `index.html` में कंटेनर `div` जोड़ा है?**
-   **क्या आपका सारा लॉजिक एक `init()` फ़ंक्शन के अंदर है?** यह लेज़ी-लोडिंग के लिए आवश्यक है।
-   **क्या आप डेटा के लिए `data-manager.js` का उपयोग कर रहे हैं?**
-   **क्या आप फीडबैक के लिए `showToast()` का उपयोग कर रहे हैं?**
-   **क्या आपने अपने पेज के शीर्ष पर एक `data-initialized` एट्रिब्यूट सेट किया है** ताकि लॉजिक दोबारा न चले?
