```json
{
  "meta": {
    "cartId": "CRT00000001",
    "version": 1.0,
    "link": {
      "userId": "USR00000002"
    }
  },
"cartItems": [
  {
    "itemId": "ITM000000000001",
    "quantity": 3,
    "addedAt": "2025-08-04T14:00:00Z"
  },
  {
    "itemId": "ITM000000000002",
    "quantity": 2,
    "addedAt": "2025-08-04T14:15:00Z"
  },
  {
    "itemId": "ITM000000000003",
    "quantity": 1,
    "addedAt": "2025-08-04T14:20:00Z"
  }
],

}
```
---
# 🛒 Cart JSON Structure Guide

यह JSON किसी user के **shopping cart** को store और restore करने के लिए है।  
इसमें केवल **minimum details** रखी जाती हैं, ताकि latest product info हमेशा product database से fetch हो सके।

---

## 1️⃣ `meta` — Cart Metadata
- `version` (string): स्कीमा या डेटा स्ट्रक्चर का वर्ज़न।  
- `cartId` — Cart का unique identifier।  
- `version` (string): स्कीमा या डेटा स्ट्रक्चर का वर्ज़न।  
- `link`  
 - `userId` — यह cart किस user का है।

---

## 2️⃣ `cartItems` — Cart Items

- `cartItems` (array of objects): कार्ट में मौजूद आइटम्स की सूची।  
  प्रत्येक ऑब्जेक्ट में:  
  - `itemId` (string) — आइटम का यूनिक ID।  
  - `quantity` (number) — उस आइटम की मात्रा।  
  - `addedAt` (string) — आइटम को कार्ट में कब जोड़ा गया (ISO 8601 फ़ॉर्मेट)।  

---
