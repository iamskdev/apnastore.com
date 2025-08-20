# 🛍️ व्यापारी स्कीमा गाइड (Merchant Schema Guide)

यह दस्तावेज़ "अपना स्टोर" प्लेटफॉर्म पर व्यापारियों (merchants) के लिए डेटा संरचना (schema) को परिभाषित करता है। यह एक व्यापक स्कीमा है जो व्यापारी की प्रोफाइल, स्थिति, प्रदर्शन और संचालन से संबंधित सभी आवश्यक जानकारी को संग्रहीत करता है।

## स्कीमा का उदाहरण (Schema Example)

यहाँ एक व्यापारी प्रोफ़ाइल का एक पूरा उदाहरण है:

```json
{
  "meta": {
    "merchantId": "MRC00000001",
    "version": 1.0,
    "keywords": ["internet cafe", "grocery store", "stationery"],
    "categories": ["Electronics", "Food & Grocery", "Services"],
    "subCategories": ["Internet Services", "Packaged Food", "Stationery"],
    "businessType": "Retailer",
    "merchantType": "Shop-Owner",
    "businessName": "Internet Cafe & Grocery",
    "tagline": "Affordable groceries & services since 1995",
    "adminNote": "Newly registered merchant, needs verification.",
    "registeredOn": "2024-06-15T10:00:00Z",
    "lastActivity": "2024-06-15T10:00:00Z",
    "approvalStatus": "approved",
    "isActive": true,
    "isVerified": true,
    "isPopular": true,
    "isNew": false,
    "isTrending": true,
    "isDiscounted": false,
    "hasStore": true,
    "links": {
      "staffIds": []
    },
    "permissions": {}
  },
  "openingHours": {
    "days": ["monday", "tuesday", "wednesday", "friday", "saturday"],
    "hours": [
      { "open": "08:00", "close": "13:00" },
      { "open": "16:00", "close": "21:00" }
    ],
    "isOpen": true,
    "note": "Opens late on public holidays."
  },

  "addresses": [
    {
      "label": "Primary Store",
      "street": "Main Road, Sector 12",
      "city": "Delhi",
      "zipCode": "110012",
      "state": "Delhi",
      "country": "India",
      "geoLocation": { "lat": 28.6139, "lng": 77.209 },
      "isPrimary": true,
      "landmark": "Near Metro Station",
      "instructions": "Use the side entrance for deliveries."
    }
  ],

  "media": {
    "logo": "/admin/assets/images/merchants/logo/internet-cafe-logo.jpg",
    "businessImage": "/admin/assets/images/merchant/unknown.jpg",
    "coverImage": "/admin/assets/images/merchant/cover.jpg",
    "gallery": [
      "/admin/assets/images/merchant/gallery/img1.jpg",
      "/admin/assets/images/merchant/gallery/img2.jpg",
      "/admin/assets/images/merchant/gallery/img3.jpg"
    ],
    "videos": [
      {
        "title": "Store Tour",
        "url": "https://www.youtube.com/watch?v=abcd1234",
        "thumbnail": "/admin/assets/images/merchant/video-thumb1.jpg"
      }
    ],
    "qrCode": "/admin/assets/images/merchant/qr/MQR00000001.png"
  },

  "operations": {
    "deliveryOptions": ["On Site", "Pickup", "Home Delivery", "Online"],
    "defaultDelivery": "On Site",
    "deliveryFee": 20,
    "minOrder": 50,
    "acceptingOrders": true,
    "paymentOptions": ["Cash", "UPI", "Card"],
    "preferredPayment": "UPI",
    "isCodAvailable": true,
    "sellsProducts": true,
    "offersServices": true
  },

  "socialLinks": {
    "facebook": "https://facebook.com/mycafe",
    "instagram": "https://instagram.com/mycafe",
    "twitter": "https://twitter.com/mycafe"
  },

  "documents": {
    "gstin": {
      "number": "07ABCDE1234F1Z5",
      "file": "/admin/assets/docs/merchant/gstin.pdf",
      "status": "verified",
      "verifiedAt": "2024-06-16T11:00:00Z"
    },
    "aadhaar": {
      "number": "1234 5678 9012",
      "file": "/admin/assets/docs/merchant/aadhaar.jpg",
      "status": "verified",
      "verifiedAt": "2024-06-16T11:00:00Z"
    },
    "pan": {
      "number": "ABCDE1234F",
      "file": "/admin/assets/docs/merchant/pan.jpg",
      "status": "rejected",
      "rejectionReason": "Image is not clear."
    },
    "license": {
      "number": "DL123456789",
      "file": "/admin/assets/docs/merchant/license.pdf",
      "status": "pending"
    },
    "fssai": {
      "number": "12345678901234",
      "file": "/admin/assets/docs/merchant/fssai.jpg",
      "status": "verified",
      "verifiedAt": "2024-06-18T15:30:00Z"
    }
  },

  "performance": {
    "rank": 1,
    "rating": 4.5,
    "reviews": 128,
    "orders": {
      "total": 540,
      "monthly": 48,
      "growth": 12
    },
    "quality": {
      "onTime": 96,
      "acceptance": 98,
      "cancellations": 1.5
    },
    "engagement": {
      "views": 1200,
      "wishlist": 85,
      "repeat": 42
    }
  },

  "inventory": {
    "available": true,
    "updatedAt": "2025-08-02T10:00:00Z",
    "counts": {
      "products": 32,
      "services": 15
    }
  },

  "subscription": {
    "plan": "Premium",
    "type": "Monthly",
    "startDate": "2025-08-01",
    "endDate": "2025-09-01",
    "status": "active",
    "autoRenew": true,
    "amount": 499
  }
}
```
---

## स्कीमा का विस्तृत विवरण

### 1. `meta` ऑब्जेक्ट  
व्यापारी की मुख्य पहचान और स्थिति की जानकारी रखता है।  

- `merchantId` (string, required): व्यापारी का यूनिक ID।  
- `version` (string): स्कीमा या डेटा स्ट्रक्चर का वर्ज़न।  
- `keywords` (array[string]): व्यवसाय को वर्णित करने वाले कीवर्ड्स।  

- `businessType` (string): व्यवसाय का प्रकार — `"Retailer"`, `"Wholesaler"`, आदि।  
- `merchantType` (string): व्यापारी की श्रेणी — `"Shop-Owner"`, `"Franchise"` आदि।  
- `businessName` (string): व्यवसाय का नाम।  
- `tagline` (string): व्यवसाय का स्लोगन।  
- `adminNote` (string): एडमिन द्वारा दी गई आंतरिक टिप्पणी।  
- `registeredOn` (string): पंजीकरण की तारीख।  
- `lastActivity` (string): व्यापारी की आख़िरी गतिविधि का समय।  
- `approvalStatus` (string): `"approved"`, `"pending"`, `"rejected"`।  
- `isActive` (boolean): क्या व्यापारी सक्रिय है।  
- `isVerified` (boolean): क्या व्यापारी सत्यापित है।  
- `isFeatured` (boolean): क्या व्यापारी को विशेष रूप से दिखाया जा रहा है।  
- `isNew` (boolean): क्या व्यापारी नया है।  
- `isTrending` (boolean): क्या व्यापारी ट्रेंडिंग में है।  
- `isDiscounted` (boolean): क्या व्यापारी छूट दे रहा है।  
- `hasStore` (boolean): क्या व्यापारी के पास स्टोर है।  
- `links` (object): व्यापारी से जुड़े ID references।  
  - `staffIds` (array[string]): व्यापारी के सभी staff IDs। उदाहरण: `["staff_001", "staff_002"]`  
- `permissions` (object): staff permissions mapping।  
  - Key = `staffId` (string) → Value = permission settings (object)।  
  - प्रत्येक permission boolean में होती है (`true` या `false`)।  
    - `canAddProduct` (boolean): क्या staff नया product जोड़ सकता है।  
    - `canEditProduct` (boolean): क्या staff product edit कर सकता है।  
    - `canDeleteProduct` (boolean): क्या staff product delete कर सकता है।  
    - `canViewOrders` (boolean): क्या staff orders देख सकता है।  
    - `canManageOrders` (boolean): क्या staff orders manage कर सकता है।  
    - `canAccessReports` (boolean): क्या staff reports देख सकता है।
---

### 2. `openingHours` ऑब्जेक्ट  
व्यवसाय के खुलने और बंद होने के समय की जानकारी।  

- `days` (array[string]): किन दिनों में स्टोर खुला रहता है।  
- `hours` (array[object]): दिन में खुलने और बंद होने के समय।  
- `isOpen` (boolean): वर्तमान में स्टोर खुला है या नहीं।  
- `note` (string): विशेष नोट, जैसे छुट्टियों पर समय बदलना।  

---

### 3. `addresses` ऐरे  
स्टोर के पतों की सूची।  

प्रत्येक पते में:  
- `label` (string): पते का लेबल — `"Primary Store"`, `"Branch"`।  
- `street` (string): सड़क का नाम।  
- `city` (string): शहर।  
- `zipCode` (string): पिन कोड।  
- `state` (string): राज्य।  
- `country` (string): देश।  
- `geoLocation` (object): अक्षांश (`lat`) और देशांतर (`lng`)।  
- `isPrimary` (boolean): क्या यह प्राथमिक पता है।  
- `landmark` (string): पास का कोई महत्वपूर्ण स्थान।  
- `instructions` (string): विशेष डिलीवरी निर्देश।  

---

### 4. `media` ऑब्जेक्ट  
व्यवसाय से संबंधित मीडिया फाइलें।  

- `logo` (string): लोगो का URL।  
- `businessImage` (string): व्यवसाय की मुख्य छवि।  
- `coverImage` (string): कवर इमेज।  
- `gallery` (array[string]): गैलरी इमेज URLs।  
- `videos` (array[object]): वीडियो विवरण।  
- `qrCode` (string): व्यापारी का QR कोड।  

---

### 5. `operations` ऑब्जेक्ट  
व्यापारी के संचालन और बिक्री विकल्प।  

- `deliveryOptions` (array[string]): `"On Site"`, `"Pickup"`, `"Home Delivery"`, `"Online"`।  
- `defaultDelivery` (string): डिफ़ॉल्ट डिलीवरी तरीका।  
- `deliveryFee` (number): डिलीवरी शुल्क।  
- `minOrder` (number): न्यूनतम ऑर्डर राशि।  
- `acceptingOrders` (boolean): क्या व्यापारी ऑर्डर स्वीकार कर रहा है।  
- `paymentOptions` (array[string]): उपलब्ध भुगतान तरीके।  
- `preferredPayment` (string): पसंदीदा भुगतान तरीका।  
- `isCodAvailable` (boolean): क्या कैश ऑन डिलीवरी उपलब्ध है।  
- `sellsProducts` (boolean): क्या व्यापारी प्रोडक्ट बेचता है।  
- `offersServices` (boolean): क्या व्यापारी सेवाएं देता है।  

---

### 6. `socialLinks` ऑब्जेक्ट  
सोशल मीडिया प्रोफाइल लिंक।  

- `facebook` (string): Facebook पेज URL।  
- `instagram` (string): Instagram प्रोफाइल URL।  
- `twitter` (string): Twitter प्रोफाइल URL।  

---

### 7. `documents` ऑब्जेक्ट  
कानूनी और पहचान दस्तावेज़।  

प्रत्येक दस्तावेज़ में:  
- `number` (string): दस्तावेज़ नंबर।  
- `file` (string): दस्तावेज़ की फ़ाइल का URL।  
- `status` (string): `"verified"`, `"pending"`, `"rejected"`।  
- `verifiedAt` (string): सत्यापन की तारीख (यदि लागू हो)।  
- `rejectionReason` (string): अस्वीकृति का कारण (यदि लागू हो)।  

---

### 8. `performance` ऑब्जेक्ट  
व्यापारी का प्रदर्शन और मीट्रिक्स।  

- `rank` (number): व्यापारी की रैंक।  
- `rating` (number): औसत रेटिंग।  
- `reviews` (number): समीक्षा की संख्या।  
- `orders` (object): कुल, मासिक और वृद्धि दर।  
- `quality` (object): ऑन-टाइम %, स्वीकृति %, रद्द दर।  
- `engagement` (object): व्यूज़, विशलिस्ट, रिपीट ग्राहक।  

---

### 9. `inventory` ऑब्जेक्ट  
स्टॉक की स्थिति।  

- `available` (boolean): क्या स्टॉक उपलब्ध है।  
- `updatedAt` (string): आखिरी अपडेट का समय।  
- `counts` (object): प्रोडक्ट और सर्विस की संख्या।  

---

### 10. `subscription` ऑब्जेक्ट  
व्यापारी के सब्सक्रिप्शन की जानकारी।  

- `plan` (string): प्लान का नाम।  
- `type` (string): `"Monthly"`, `"Yearly"` आदि।  
- `startDate` (string): शुरुआत की तारीख।  
- `endDate` (string): समाप्ति की तारीख।  
- `status` (string): `"active"`, `"expired"`, `"cancelled"`।  
- `autoRenew` (boolean): क्या ऑटो-रिन्यू चालू है।  
- `amount` (number): सब्सक्रिप्शन राशि।

## स्कीमा का विस्तृत विवरण

### 1. `meta` ऑब्जेक्ट  
व्यापारी की मुख्य पहचान और स्थिति की जानकारी रखता है।  

- `merchantId` (string, required): व्यापारी का यूनिक ID।  
- `version` (string): स्कीमा या डेटा स्ट्रक्चर का वर्ज़न।  
- `keywords` (array[string]): व्यवसाय को वर्णित करने वाले कीवर्ड्स।  
- `businessType` (string): व्यवसाय का प्रकार — `"Retailer"`, `"Wholesaler"`, आदि।  
- `merchantType` (string): व्यापारी की श्रेणी — `"Shop-Owner"`, `"Franchise"` आदि।  
- `businessName` (string): व्यवसाय का नाम।  
- `tagline` (string): व्यवसाय का स्लोगन।  
- `adminNote` (string): एडमिन द्वारा दी गई आंतरिक टिप्पणी।  
- `registeredOn` (string): पंजीकरण की तारीख।  
- `lastActivity` (string): व्यापारी की आख़िरी गतिविधि का समय।  
- `approvalStatus` (string): `"approved"`, `"pending"`, `"rejected"`।  
- `isActive` (boolean): क्या व्यापारी सक्रिय है।  
- `isVerified` (boolean): क्या व्यापारी सत्यापित है।  
- `isFeatured` (boolean): क्या व्यापारी को विशेष रूप से दिखाया जा रहा है।  
- `isNew` (boolean): क्या व्यापारी नया है।  
- `isTrending` (boolean): क्या व्यापारी ट्रेंडिंग में है।  
- `isDiscounted` (boolean): क्या व्यापारी छूट दे रहा है।  
- `hasStore` (boolean): क्या व्यापारी के पास स्टोर है।  
- `links` (object): व्यापारी से जुड़े ID references।  
  - `staffIds` (array[string]): व्यापारी के सभी staff IDs। उदाहरण: `["staff_001", "staff_002"]`  
- `permissions` (object): staff permissions mapping।  
  - Key = `staffId` (string) → Value = permission settings (object)।  
  - प्रत्येक permission boolean में होती है (`true` या `false`)।  
    - `canAddProduct` (boolean): क्या staff नया product जोड़ सकता है।  
    - `canEditProduct` (boolean): क्या staff product edit कर सकता है।  
    - `canDeleteProduct` (boolean): क्या staff product delete कर सकता है।  
    - `canViewOrders` (boolean): क्या staff orders देख सकता है।  
    - `canManageOrders` (boolean): क्या staff orders manage कर सकता है।  
    - `canAccessReports` (boolean): क्या staff reports देख सकता है।
---

### 2. `openingHours` ऑब्जेक्ट  
व्यवसाय के खुलने और बंद होने के समय की जानकारी।  

- `days` (array[string]): किन दिनों में स्टोर खुला रहता है।  
- `hours` (array[object]): दिन में खुलने और बंद होने के समय।  
- `isOpen` (boolean): वर्तमान में स्टोर खुला है या नहीं।  
- `note` (string): विशेष नोट, जैसे छुट्टियों पर समय बदलना।  

---

### 3. `addresses` ऐरे  
स्टोर के पतों की सूची।  

प्रत्येक पते में:  
- `label` (string): पते का लेबल — `"Primary Store"`, `"Branch"`।  
- `street` (string): सड़क का नाम।  
- `city` (string): शहर।  
- `zipCode` (string): पिन कोड।  
- `state` (string): राज्य।  
- `country` (string): देश।  
- `geoLocation` (object): अक्षांश (`lat`) और देशांतर (`lng`)।  
- `isPrimary` (boolean): क्या यह प्राथमिक पता है।  
- `landmark` (string): पास का कोई महत्वपूर्ण स्थान।  
- `instructions` (string): विशेष डिलीवरी निर्देश।  

---

### 4. `media` ऑब्जेक्ट  
व्यवसाय से संबंधित मीडिया फाइलें।  

- `logo` (string): लोगो का URL।  
- `businessImage` (string): व्यवसाय की मुख्य छवि।  
- `coverImage` (string): कवर इमेज।  
- `gallery` (array[string]): गैलरी इमेज URLs।  
- `videos` (array[object]): वीडियो विवरण।  
- `qrCode` (string): व्यापारी का QR कोड।  

---

### 5. `operations` ऑब्जेक्ट  
व्यापारी के संचालन और बिक्री विकल्प।  

- `deliveryOptions` (array[string]): `"On Site"`, `"Pickup"`, `"Home Delivery"`, `"Online"`।  
- `defaultDelivery` (string): डिफ़ॉल्ट डिलीवरी तरीका।  
- `deliveryFee` (number): डिलीवरी शुल्क।  
- `minOrder` (number): न्यूनतम ऑर्डर राशि।  
- `acceptingOrders` (boolean): क्या व्यापारी ऑर्डर स्वीकार कर रहा है।  
- `paymentOptions` (array[string]): उपलब्ध भुगतान तरीके।  
- `preferredPayment` (string): पसंदीदा भुगतान तरीका।  
- `isCodAvailable` (boolean): क्या कैश ऑन डिलीवरी उपलब्ध है।  
- `sellsProducts` (boolean): क्या व्यापारी प्रोडक्ट बेचता है।  
- `offersServices` (boolean): क्या व्यापारी सेवाएं देता है।  

---

### 6. `socialLinks` ऑब्जेक्ट  
सोशल मीडिया प्रोफाइल लिंक।  

- `facebook` (string): Facebook पेज URL।  
- `instagram` (string): Instagram प्रोफाइल URL।  
- `twitter` (string): Twitter प्रोफाइल URL।  

---

### 7. `documents` ऑब्जेक्ट  
कानूनी और पहचान दस्तावेज़।  

प्रत्येक दस्तावेज़ में:  
- `number` (string): दस्तावेज़ नंबर।  
- `file` (string): दस्तावेज़ की फ़ाइल का URL।  
- `status` (string): `"verified"`, `"pending"`, `"rejected"`।  
- `verifiedAt` (string): सत्यापन की तारीख (यदि लागू हो)।  
- `rejectionReason` (string): अस्वीकृति का कारण (यदि लागू हो)।  

---

### 8. `performance` ऑब्जेक्ट  
व्यापारी का प्रदर्शन और मीट्रिक्स।  

- `rank` (number): व्यापारी की रैंक।  
- `rating` (number): औसत रेटिंग।  
- `reviews` (number): समीक्षा की संख्या।  
- `orders` (object): कुल, मासिक और वृद्धि दर।  
- `quality` (object): ऑन-टाइम %, स्वीकृति %, रद्द दर।  
- `engagement` (object): व्यूज़, विशलिस्ट, रिपीट ग्राहक।  

---

### 9. `inventory` ऑब्जेक्ट  
स्टॉक की स्थिति।  

- `available` (boolean): क्या स्टॉक उपलब्ध है।  
- `updatedAt` (string): आखिरी अपडेट का समय।  
- `counts` (object): प्रोडक्ट और सर्विस की संख्या।  

---

### 10. `subscription` ऑब्जेक्ट  
व्यापारी के सब्सक्रिप्शन की जानकारी।  

- `plan` (string): प्लान का नाम।  
- `type` (string): `"Monthly"`, `"Yearly"` आदि।  
- `startDate` (string): शुरुआत की तारीख।  
- `endDate` (string): समाप्ति की तारीख।  
- `status` (string): `"active"`, `"expired"`, `"cancelled"`।  
- `autoRenew` (boolean): क्या ऑटो-रिन्यू चालू है।  
- `amount` (number): सब्सक्रिप्शन राशि।