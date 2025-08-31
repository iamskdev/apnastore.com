> **DOCUMENT AUDIT**
> - **Status:** `Updated`
> - **Last Reviewed:** 31/08/2025 23:59:00 IST (Updated by Gemini)
> - **Reviewer:** Santosh (with Gemini)
> - **Purpose:** This document provides a comprehensive guide to all Firestore data collections, detailing each schema's structure, fields, and relationships. It is the single source of truth for the data model.

---
# 🛍️ mStore - विस्तृत स्कीमा गाइड

यह दस्तावेज़ "mStore" एप्लिकेशन के लिए उपयोग किए जाने वाले सभी फायरस्टोर डेटा संग्रह (collections) के लिए एक व्यापक गाइड है। यह प्रत्येक स्कीमा की संरचना, उसके फ़ील्ड्स के उद्देश्य और विभिन्न संग्रहों के बीच संबंधों का विवरण देता है।

---

## 📖 विषय-सूची (Table of Contents)

1.  [Users (`users.json`)](#1-users-usersjson) - उपयोगकर्ता प्रोफाइल और प्रमाणीकरण।
2.  [Accounts (`accounts.json`)](#2-accounts-accountsjson) - उपयोगकर्ता-विशिष्ट डेटा जैसे कार्ट और सेटिंग्स।
3.  [Merchants (`merchants.json`)](#3-merchants-merchantsjson) - व्यापारी और स्टोरफ्रंट जानकारी।
4.  [Items (`items.json`)](#4-items-itemsjson) - व्यापारियों द्वारा बेचे जाने वाले उत्पाद और सेवाएँ।
5.  [Categories (`categories.json`)](#5-categories-categoriesjson) - उत्पादों और सेवाओं के लिए श्रेणियाँ।
6.  [Orders (`orders.json`)](#6-orders-ordersjson) - ग्राहक के ऑर्डर और उनकी स्थिति।
7.  [Alerts & Campaigns (`alerts.json`, `campaigns.json`)](#7-alerts--campaigns-alertsjson-campaignsjson) - अधिसूचना प्रणाली।
8.  [Promotions (`promotions.json`)](#8-promotions-promotionsjson) - विशेष UI ओवरराइड और प्रचार।
9.  [Logs (`logs.json`)](#9-logs-logsjson) - ऑडिटिंग और डिबगिंग के लिए इवेंट लॉग।
10. [Price Logs (`price-logs.json`)](#10-price-logs-price-logsjson) - मूल्य परिवर्तन का इतिहास।
11. [Units (`units.json`)](#11-units-unitsjson) - माप की इकाइयाँ।
12. [Brands (`brands.json`)](#12-brands-brandsjson) - उत्पाद ब्रांड।

---

## 1. Users (`users.json`)

यह संग्रह ऐप के सभी उपयोगकर्ताओं (ग्राहक, व्यापारी, एडमिन) के लिए मुख्य पहचान और प्रोफ़ाइल जानकारी संग्रहीत करता है।

### मुख्य ऑब्जेक्ट्स:

-   **`meta`**: उपयोगकर्ता की पहचान, भूमिकाएँ और स्थिति के लिए मेटाडेटा।
    -   `userId` (string): अद्वितीय उपयोगकर्ता ID (जैसे `USR...`) - प्राइमरी की।
    -   `roles` (array): उपयोगकर्ता को सौंपी गई भूमिकाएँ (`user`, `merchant`, `admin`)।
    -   `primaryRole` (string): उपयोगकर्ता की प्राथमिक भूमिका।
    -   `links` (object): अन्य संग्रहों से संबंध (`accountId`, `merchantId`)।
    -   `flags` (object): बूलियन मान जो उपयोगकर्ता की स्थिति दर्शाते हैं (`isActive`, `isSuspended`, `isVerified`, `isAdmin`, आदि)।
    -   `version` (number): दस्तावेज़ का संस्करण।
-   **`info`**: उपयोगकर्ता की व्यक्तिगत जानकारी।
    -   `fullName`, `nickName`, `gender`, `dob`, `avatar`, `tagline`, `bio`, `email`, `phone`।
-   **`address`** (array): उपयोगकर्ता के पतों की सूची।
    -   प्रत्येक ऑब्जेक्ट में `label`, `isPrimary`, `street`, `city`, `state`, `zipCode`, `geoLocation` होता है।
-   **`subscription`** (object): उपयोगकर्ता की सदस्यता का विवरण।
    -   `plan`, `type`, `startDate`, `endDate`, `status`, `autoRenew`, `amount`।
-   **`auth`**: प्रमाणीकरण से संबंधित विस्तृत विवरण।
    -   `login` (object): लॉगिन प्रयास, विधि और पासवर्ड की जानकारी।
    -   `flags` (object): सुरक्षा-संबंधी फ़्लैग (`twoFactorEnabled`, `emailVerified`, `accountLocked`)।
    -   `recovery` (object): खाता पुनर्प्राप्ति के लिए ईमेल, फ़ोन और सुरक्षा प्रश्न।
    -   `provider` (object): फायरबेस प्रमाणीकरण प्रदाता (`uid`, `fcmToken`)।

### संभावित स्थितियाँ और भविष्य के सुधार:
-   **अतिथि से पंजीकृत उपयोगकर्ता:** जब एक अतिथि (guest) उपयोगकर्ता साइन अप करता है, तो उसके अतिथि खाते (`isGuest: true` वाले `accounts` दस्तावेज़) को एक नए `users` दस्तावेज़ से जोड़ा जा सकता है, जिससे उसकी कार्ट और सहेजी गई वस्तुएँ बनी रहें।
-   **भूमिका परिवर्तन:** यदि कोई `user` एक `merchant` बन जाता है, तो `roles` ऐरे को अपडेट किया जाएगा और एक नया `merchantId` `links` ऑब्जेक्ट में जोड़ा जाएगा। `primaryRole` यह निर्धारित करेगा कि उपयोगकर्ता को डिफ़ॉल्ट रूप से कौन सा डैशबोर्ड दिखाई देता है।
-   **खाता निलंबन (Suspension):** `meta.flags.isSuspended` को `true` पर सेट करके किसी उपयोगकर्ता को अस्थायी रूप से निलंबित किया जा सकता है। सुरक्षा नियमों को यह सुनिश्चित करना चाहिए कि निलंबित उपयोगकर्ता लॉगिन नहीं कर सकते।
-   **KYC सत्यापन:** भविष्य में, `kycStatus` (`pending`, `verified`, `rejected`) का उपयोग उच्च-मूल्य वाले लेनदेन या व्यापारी ऑनबोर्डिंग के लिए किया जा सकता है।

---

## 2. Accounts (`accounts.json`)

यह संग्रह प्रत्येक उपयोगकर्ता के लिए गतिशील और व्यक्तिगत डेटा संग्रहीत करता है।

### मुख्य फ़ील्ड्स:

-   **`meta`**: खाते का मेटाडेटा (`accountId`, `links.userId`)।
-   **`cart`**: उपयोगकर्ता की शॉपिंग कार्ट।
-   **`saved`**: उपयोगकर्ता द्वारा सहेजे गए आइटम (विशलिस्ट)।
-   **`deviceInfo`**: उपयोगकर्ता द्वारा उपयोग किए गए उपकरणों की सूची।
-   **`settings`**: उपयोगकर्ता-विशिष्ट सेटिंग्स (`theme`, `language`)।
-   **`searchHistory`**: हाल की खोजें।

### संभावित स्थितियाँ और भविष्य के सुधार:
-   जब कोई नया उपयोगकर्ता पंजीकरण करता है, तो एक `users` दस्तावेज़ और एक संबंधित `accounts` दस्तावेज़ स्वचालित रूप से एक साथ बनाए जाते हैं।
-   `deviceInfo` का उपयोग यह ट्रैक करने के लिए किया जा सकता है कि उपयोगकर्ता कितने उपकरणों पर लॉग इन है।
-   **क्रॉस-डिवाइस सिंक:** जब उपयोगकर्ता किसी नए डिवाइस पर लॉग इन करता है, तो `deviceInfo` में एक नई प्रविष्टि जोड़ी जाती है। कार्ट (`cart`) और सहेजी गई वस्तुएँ (`saved`) जैसी जानकारी को सभी सक्रिय उपकरणों में सिंक किया जाना चाहिए।
-   **निजीकरण (Personalization):** `personalized` ऑब्जेक्ट का उपयोग उपयोगकर्ता के व्यवहार (देखे गए आइटम, खरीदे गए ब्रांड) के आधार पर एक वैयक्तिकृत अनुभव प्रदान करने के लिए किया जा सकता है।

---

## 3. Merchants (`merchants.json`)

यह संग्रह प्लेटफॉर्म पर पंजीकृत व्यापारियों की सभी जानकारी संग्रहीत करता है।

### मुख्य ऑब्जेक्ट्स:

-   **`meta`**: व्यापारी का मेटाडेटा।
    -   `merchantId`, `version`, `type`, `status`, `priority`, `flags`, `links`, `info` (जिसमें `name`, `logo`, `qrCode`, `tagline` शामिल हैं)।
-   **`openingHours`** (object): स्टोर के खुलने का समय, `isOpen` फ़्लैग और नोट।
-   **`addresses`** (array): भौतिक स्टोर के पते।
-   **`socialLinks`** (object): फेसबुक, इंस्टाग्राम, ट्विटर के लिए लिंक।
-   **`engagement`** (object): `rank`, `rating`, `reviews`, `views` जैसे मीट्रिक्स।
-   **`seo`** (object): SEO के लिए `title`, `description`, `keywords`।
-   **`subscription`** (object): व्यापारी की सदस्यता का विवरण।
-   **`audit`** (object): `createdAt`, `createdBy`, `updatedAt`, `updatedBy` के साथ ऑडिट ट्रेल्स।

### संभावित स्थितियाँ और भविष्य के सुधार:
-   एक नया व्यापारी पंजीकरण करने पर `pending` स्थिति में हो सकता है जब तक कि एक एडमिन उसे `approved` न कर दे।
-   `flags.isPopular` या `flags.isNew` का उपयोग करके व्यापारियों को होमपेज पर विशेष रूप से प्रदर्शित किया जा सकता है।
-   **स्टाफ प्रबंधन:** भविष्य में, एक `staff` संग्रह बनाया जा सकता है। व्यापारी अपने `meta.links.staffIds` में स्टाफ सदस्यों को जोड़ सकते हैं और `permissions` ऑब्जेक्ट का उपयोग करके उनकी पहुँच को नियंत्रित कर सकते हैं (जैसे, एक स्टाफ सदस्य केवल ऑर्डर देख सकता है, लेकिन आइटम संपादित नहीं कर सकता)।
-   **भुगतान विवरण:** भविष्य में, बैंक खाते के विवरण या UPI ID को संग्रहीत करने के लिए एक `payouts` या `banking` ऑब्जेक्ट जोड़ा जा सकता है ताकि व्यापारी को भुगतान किया जा सके।

---

## 4. Items (`items.json`)

यह संग्रह व्यापारियों द्वारा बेचे जाने वाले सभी उत्पादों और सेवाओं का प्रतिनिधित्व करता है।

### मुख्य ऑब्जेक्ट्स:

-   **`meta`**: आइटम का मेटाडेटा।
    -   `itemId`, `type` (`product`/`service`), `version`, `priority`, `flags`, `links` (`merchantId`, `brandId`, `unitId`, `categoryId` - **अब `ICT` उपसर्ग के साथ**)।
    -   **`categories`** (array): आइटम से संबंधित मुख्य श्रेणियों की सूची (प्रत्येक में `slug` और `categoryId` शामिल)।
    -   **`subcategories`** (array): आइटम से संबंधित उप-श्रेणियों की सूची (प्रत्येक में `slug` और `subCatId` शामिल)।
-   **`info`**: आइटम का विस्तृत विवरण।
    -   `name`, `sku`, `hsnCode`, `barcode`, `note`, `description`, `attributes`।
-   **`pricing`**: मूल्य निर्धारण की जानकारी।
    -   `mrp`, `costPrice`, `sellingPrice`, `currency`, `discounts` (array)।
-   **`inventory`**: स्टॉक प्रबंधन।
    -   `stockQty`, `batchId`, `expiryDate`, `lowStockThreshold`, `isLowStock`।
-   **`media`**: आइटम की मीडिया फ़ाइलें।
    -   `thumbnail` (string), `gallery` (array), `video` (string)।
-   **`analytics`**: आइटम का प्रदर्शन।
    -   `rating`, `numReviews`, `views`, `saved`, `carted`, `totalSales`।
-   **`seo`** (object): SEO के लिए `title`, `keywords`, `description`।
-   **`audit`** (object): `createdAt`, `createdBy`, `updatedAt`, `updatedBy` के साथ ऑडिट ट्रेल्स।

### संभावित स्थितियाँ और भविष्य के सुधार:
-   एक "सेवा" (service) के लिए, `inventory` ऑब्जेक्ट में अधिकांश फ़ील्ड `null` होंगे।
-   `flags.isFeatured` का उपयोग करके किसी आइटम को होमपेज पर प्रमुखता से दिखाया जा सकता है।
-   **कैटेगरी और सबकैटेगरी लिंकिंग:** `items.json` में `categories` और `subcategories` एरे को `categories.json` में परिभाषित स्लग और IDs के साथ पॉपुलेट किया जाता है, जिससे फ़िल्टरिंग और नेविगेशन आसान हो जाता है।
-   **उत्पाद वेरिएंट (Product Variants):** भविष्य में, एक ही उत्पाद के विभिन्न वेरिएंट (जैसे, टी-शर्ट के लिए अलग-अलग आकार और रंग) को संभालने के लिए स्कीमा को बढ़ाया जा सकता है। यह एक `variants` ऐरे जोड़कर किया जा सकता है, जहाँ प्रत्येक ऑब्जेक्ट का अपना `sku`, `price`, और `attributes` (जैसे `size: "M"`, `color: "Red"`) होता है।
-   **बंडल उत्पाद (Bundled Products):** एक `isBundle: true` ध्वज और एक `bundledItems` ऐरे जोड़ा जा सकता है जिसमें बंडल में शामिल `itemId` और `quantity` की सूची हो।

---
## 5. Categories (`categories.json`)

यह संग्रह उत्पादों और सेवाओं को व्यवस्थित करने के लिए एक पदानुक्रमित संरचना प्रदान करता है।

### मुख्य फ़ील्ड्स:

-   **`meta`**: श्रेणी का मेटाडेटा (`categoryId`, `slug`, `icon`)।
-   **`subcategories`** (array): इस मुख्य श्रेणी के अंतर्गत आने वाली उप-श्रेणियों की एक सूची।

### संभावित स्थितियाँ और भविष्य के सुधार:
-   एक श्रेणी में उप-श्रेणियाँ नहीं हो सकती हैं, उस स्थिति में `subcategories` ऐरे खाली या अनुपस्थित होगा।
-   **बहु-स्तरीय पदानुक्रम (Multi-level Hierarchy):** भविष्य में, `subcategories` के भीतर एक और `subcategories` ऐरे जोड़कर गहरे स्तर की श्रेणियाँ (जैसे, Electronics > Mobiles > Smartphones) बनाई जा सकती हैं।
-   **विशेषता लिंकिंग (Attribute Linking):** प्रत्येक श्रेणी को उन विशेषताओं (attributes) से जोड़ा जा सकता है जो उस श्रेणी के उत्पादों के लिए प्रासंगिक हैं (जैसे, 'Mobiles' श्रेणी के लिए 'RAM', 'Storage', 'Screen Size')। यह फ़िल्टरिंग को अधिक गतिशील बना देगा।

---

## 6. Orders (`orders.json`)

यह संग्रह ग्राहकों द्वारा दिए गए सभी ऑर्डर का रिकॉर्ड रखता है।

### मुख्य फ़ील्ड्स:

-   **`meta`**: ऑर्डर का मेटाडेटा (`orderId`, `links.userId`)।
-   **`orderItems`** (object): ऑर्डर किए गए आइटमों का एक मैप, जिसमें `quantity` और `snapshot` शामिल है।
-   **`delivery`**: डिलीवरी का पता और निर्देश।
-   **`orderStatus`**: ऑर्डर की वर्तमान स्थिति (`current`) और उसका इतिहास (`timeline`)।
-   **`payment`**: भुगतान की स्थिति और विवरण।
-   **`logistics`**: शिपमेंट और कूरियर से संबंधित विवरण।
-   **`comments`**: ग्राहक और व्यापारी द्वारा जोड़े गए नोट्स।

### संभावित स्थितियाँ और भविष्य के सुधार:
-   यदि कोई उपयोगकर्ता ऑर्डर देने के बाद अपना डिलीवरी पता बदलता है, तो `delivery.changedAddress` ऐरे में पुराने पते का रिकॉर्ड रखा जा सकता है।
-   **ऑर्डर रद्दीकरण (Cancellation):** जब कोई ऑर्डर रद्द किया जाता है, तो `orderStatus.current` को `"cancelled"` पर सेट किया जाता है और `cancelledAt` टाइमस्टैम्प जोड़ा जाता है। रद्द किए गए आइटमों को वापस इन्वेंट्री में जोड़ा जाना चाहिए।
-   **रिटर्न और रिफंड (Returns & Refunds):** भविष्य में, रिटर्न को संभालने के लिए एक `returns` ऑब्जेक्ट जोड़ा जा सकता है, जिसमें रिटर्न का कारण, स्थिति (`pending`, `approved`, `rejected`), और रिफंड विवरण शामिल होंगे।
-   **आंशिक डिलीवरी (Partial Delivery):** यदि एक ऑर्डर को कई शिपमेंट में विभाजित किया जाता है, तो `orderItems` में प्रत्येक आइटम को एक `shipmentId` से जोड़ा जा सकता है।

---

## 7. Alerts & Campaigns (`alerts.json`, `campaigns.json`)

यह दो-भाग वाली प्रणाली ऐप की अधिसूचना प्रणाली को शक्ति प्रदान करती है। `campaigns` का उपयोग बड़े पैमाने पर घोषणाओं के लिए किया जाता है, जो बाद में प्रत्येक लक्षित उपयोगकर्ता के लिए `alerts` संग्रह में व्यक्तिगत अलर्ट उत्पन्न करता है।

---

## 8. Promotions (`promotions.json`)

इसका उपयोग ऐप के UI के कुछ हिस्सों (जैसे हेडर, बॉटम नेविगेशन) को गतिशील रूप से ओवरराइड करने के लिए किया जाता है, आमतौर पर किसी विशिष्ट व्यापारी को बढ़ावा देने के लिए।

---

## 9. Logs (`logs.json`)

यह संग्रह ऑडिटिंग, डिबगिंग और विश्लेषण के लिए ऐप के भीतर होने वाली महत्वपूर्ण घटनाओं (`order_created`, `user_registered`) का रिकॉर्ड रखता है।

---

## 10. Price Logs (`price-logs.json`)

यह संग्रह किसी आइटम के मूल्य में होने वाले प्रत्येक परिवर्तन को ट्रैक करता है, जो पारदर्शिता और ऐतिहासिक डेटा विश्लेषण के लिए महत्वपूर्ण है।

---

## 11. Units (`units.json`)

यह संग्रह माप की विभिन्न इकाइयों (`weight`, `volume`) और उनके रूपांतरण कारकों को परिभाषित करता है।

---

## 12. Brands (`brands.json`)

यह संग्रह उन सभी ब्रांडों की सूची संग्रहीत करता है जिनके उत्पाद प्लेटफॉर्म पर बेचे जाते हैं।

---

## हाल के परिवर्तन (Recent Changes) - 31 August 2025

- **Schema Guide Overhaul:** `users`, `items`, और `merchants` संग्रहों के लिए स्कीमा को वर्तमान JSON डेटा संरचना को दर्शाने के लिए पूरी तरह से अपडेट किया गया। कई नए ऑब्जेक्ट्स और फ़ील्ड्स जोड़े गए जो पहले दस्तावेज़ में नहीं थे।
- **Added Future Scenarios:** Re-integrated the "Potential Scenarios and Future Improvements" sections to provide context for future development.
