# Apna Store update promotions.json schema - प्रमोशन स्कीमा गाइड

यह दस्तावेज़ प्रमोशन सिस्टम के लिए डेटा संरचना (schema) को परिभाषित करता है। यह एक शक्तिशाली, डेटा-चालित प्रणाली है जो विभिन्न प्रकार के प्रमोशन, जैसे कि ब्रांडेड टेकओवर, कूपन, और विशेष ऑफ़र चलाने की अनुमति देती है।

## स्कीमा का उदाहरण

यहाँ एक `brand_takeover` प्रमोशन का एक पूरा उदाहरण है:

```json
{
  "meta": {
    "promoId": "PRM00000001",
    "promoName": "Monsoon Bonanza",
    "promoType": "brand_takeover",
    "version": 1.0,
    "links": {
      "userId": "USR00000001",
      "merchantId": "MRC00000001"
    },
    "status": {
      "isActive": true,
      "priority": 1,
      "visibility": "public"
    },
    "schedule": {
      "start": "2025-07-22T00:00:00Z",
      "end": "2025-07-29T23:59:59Z"
    },
    "createdAt": "2025-07-22T00:00:00Z",
    "updatedAt": "2025-07-22T00:00:00Z"
  },
  "display": {
    "banner": {
      "image": "/promotions/banners/icg-banner.jpg",
      "tagline": "Affordable groceries & fast internet!",
      "description": "Limited time promotion for our best-selling merchant!"
    },
    "notification": {
      "enabled": true,
      "title": "Promotion Time!",
      "message": "🔥 Exclusive offers from Internet Cafe & Grocery!",
      "type": "info",
      "icon": "fas fa-bullhorn"
    }
  },
  "targeting": {
    "locations": ["Mumbai", "Delhi"],
    "userGroups": ["new_users", "loyal_customers"],
    "platforms": ["web", "android", "ios", "desktop"]
  },
  "rules": {
    "minOrderValue": 500,
    "maxUsagePerUser": 1,
    "applicableItems": {
      "type": "include",
      "itemIds": ["ITM000000000001", "ITM000000000006"],
      "categoryIds": []
    }
  },
  "reward": {
    "type": "percentage_discount",
    "value": {
      "percent": 20,
      "maxAmount": 200
    },
    "description": "Get 20% OFF upto Rs200",
    "couponCode": "MONSOON20" 
  },
  "ui_overrides": {
    "header": {
      "backgroundColor": "#FF5733",
      "textColor": "#ffffff"
    },

    "bottomNav": [
      {
        "label": "Home",
        "icon": "fas fa-home"
      }
    ]
  },
  "analytics": {
    "views": 0,
    "clicks": 0,
    "conversions": 0
  }
}
```

---
## स्कीमा का विस्तृत विवरण (Updated)

### 1. `meta` ऑब्जेक्ट
यह ऑब्जेक्ट प्रमोशन की मुख्य पहचान और सेटिंग्स को संग्रहीत करता है।

- `promoId` (string, required): प्रमोशन का यूनिक ID।
- `promoName` (string): प्रमोशन का नाम।
- `promoType` (enum, required): प्रमोशन का प्रकार।
  - `brand_takeover`: पूरे ऐप का UI और कंटेंट एक व्यापारी के लिए बदल देता है।
  - `coupon`: कार्ट में एक डिस्काउंट कोड लागू करता है।
  - `bogo`: "Buy One, Get One" ऑफ़र।
  - `flash_sale`: सीमित समय के लिए भारी छूट।
- `links` (object): प्रमोशन किस merchant और किस user से जुड़ा है।
  - `userId` (string): प्रमोशन बनाने वाला यूज़र।
  - `merchantId` (string): संबंधित व्यापारी।
- `status` (object): प्रमोशन की वर्तमान स्थिति।
  - `isActive` (boolean): क्या यह प्रमोशन अभी लाइव है?
  - `priority` (integer): प्राथमिकता। कम नंबर मतलब ज़्यादा प्राथमिकता।
  - `visibility` (string): कौन देख सकता है (`public`, `private`, `restricted`)।
- `schedule` (object): प्रमोशन की समय-सीमा।
  - `start` (string): शुरू होने की तारीख (ISO 8601 format)।
  - `end` (string): खत्म होने की तारीख (ISO 8601 format)।
- `createdAt` (string): प्रमोशन कब बनाया गया (ISO 8601 format)।
- `updatedAt` (string): प्रमोशन आखिरी बार कब अपडेट हुआ (ISO 8601 format)।
- `version` (string): स्कीमा या डेटा स्ट्रक्चर का वर्ज़न।  

---

### 2. `display` ऑब्जेक्ट
यह ऑब्जेक्ट नियंत्रित करता है कि प्रमोशन उपयोगकर्ता को कैसे दिखेगा।

- `banner` (object): प्रमोशन का बैनर।
  - `image` (string): बैनर की इमेज का पाथ।
  - `tagline` (string): छोटी, आकर्षक लाइन।
  - `description` (string): पूरा विवरण।
- `notification` (object): पुश नोटिफिकेशन सेटिंग्स।
  - `enabled` (boolean): क्या इस प्रमोशन के लिए पुश नोटिफिकेशन भेजना है?
  - `title` (string): नोटिफिकेशन का टाइटल।
  - `message` (string): नोटिफिकेशन का मैसेज।
  - `type` (string, optional): नोटिफिकेशन का प्रकार (`info`, `success`, `warning`, `error`)।
  - `icon` (string, optional): Font Awesome आइकन क्लास।

---

### 3. `targeting` ऑब्जेक्ट
यह ऑब्जेक्ट परिभाषित करता है कि प्रमोशन किसे दिखाया जाना चाहिए।

- `locations` (array of strings): किन शहरों या क्षेत्रों में यह प्रमोशन लागू है।
- `userGroups` (array of strings): किन यूज़र ग्रुप्स के लिए है (जैसे, `new_users`, `loyal_customers`)।
- `platforms` (array of strings): किन प्लेटफ़ॉर्म्स पर दिखाना है (जैसे, `web`, `android`, `ios`, `desktop`)।

---

### 4. `rules` ऑब्जेक्ट
यह ऑब्जेक्ट उन शर्तों को परिभाषित करता है जिन्हें इनाम पाने के लिए पूरा करना होगा।

- `minOrderValue` (number): इनाम लागू करने के लिए न्यूनतम ऑर्डर मूल्य।
- `maxUsagePerUser` (integer): एक यूज़र इस प्रमोशन का कितनी बार इस्तेमाल कर सकता है (`null` का मतलब असीमित)।
- `applicableItems` (object): यह प्रमोशन किन आइटम्स पर लागू होगा।
  - `type` (string): `'include'` (सिर्फ इन पर लागू) या `'exclude'` (इनको छोड़कर सब पर लागू)।
  - `itemIds` (array of strings): आइटम IDs की सूची जिन पर यह नियम लागू होता है।
  - `categoryIds` (array of strings): कैटेगरी IDs की सूची जिन पर यह नियम लागू होता है।

---

### 5. `reward` ऑब्जेक्ट
यह ऑब्जेक्ट बताता है कि उपयोगकर्ता को इनाम में क्या मिलेगा।

- `type` (enum): इनाम का प्रकार।
  - `percentage_discount`: प्रतिशत छूट।
  - `fixed_discount`: निश्चित राशि की छूट।
  - `bogo`: एक खरीदें, एक मुफ्त पाएं।
  - `flash_sale`: सीमित समय के लिए भारी छूट।
  - `free_shipping`: मुफ़्त शिपिंग।
  - `free_item`: एक मुफ़्त आइटम।
- `value` (object): इनाम का मान, जो `type` पर निर्भर करता है।
  - **अगर `type` है `percentage_discount`**:
    - `percent` (number): छूट का प्रतिशत।
    - `maxAmount` (number): अधिकतम छूट की राशि।
  - **अगर `type` है `fixed_discount`**:
    - `amount` (number): छूट की निश्चित राशि।
  - **अगर `type` है `bogo`**:
    - `buyItemId` (string): खरीदने वाला आइटम।
    - `getItemId` (string): मुफ़्त मिलने वाला आइटम।
  - **अगर `type` है `free_item`**:
    - `itemId` (string): मुफ़्त मिलने वाला आइटम।
    - `quantity` (integer): कितनी मात्रा में।
- `couponCode` (string, optional): कूपन कोड, यदि प्रमोशन कूपन-आधारित है।
---

### 6. `ui_overrides` ऑब्जेक्ट (वैकल्पिक)
यह ऑब्जेक्ट केवल `brand_takeover` प्रकार के प्रमोशन के लिए है।  
अगर मौजूद नहीं है, तो ऐप व्यापारी की डिफ़ॉल्ट ब्रांडिंग को इस्तेमाल करेगा।

- `header` (object):
  - `backgroundColor` (string): हेडर का बैकग्राउंड कलर।
  - `textColor` (string): हेडर का टेक्स्ट कलर।
  - `logo` (string, optional): लोगो का पाथ।
  - `title` (string, optional): हेडर टाइटल।
- `bottomNav` (array of objects):
  - `label` (string): बटन का टेक्स्ट।
  - `icon` (string): Font Awesome आइकन क्लास।
  - `link` (string): बटन का लिंक।

---

### 7. `analytics` ऑब्जेक्ट
प्रमोशन के प्रदर्शन को ट्रैक करता है।

- `views` (integer): प्रमोशन को कितनी बार देखा गया।
- `clicks` (integer): प्रमोशन पर कितनी बार क्लिक किया गया।
- `conversions` (integer): प्रमोशन से कितनी खरीदारी हुई।