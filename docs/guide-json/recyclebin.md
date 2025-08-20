```json
{
  "meta": {
    "binId": "bin_001",
    "version": 1.0,
    "status": "deleted",
    "originalId": "ITM000000000001",
    "originalType": "item",
  },
  "audit": {
    "deleted": {
      "reason": "Discontinued product"
    },
       "by": "MRC00000001",
      "role": "merchant",
      "at": "2025-08-10T12:00:00Z",
      "ipAddress": "103.25.59.45",
   "restored": {
      "by": null,
      "at": null,
      "role": null,
      "ipAddress": null
    },
    "expiresAt": "2025-09-09T12:00:00Z"
  },
  }

```
---
# 🗑 Recycle Bin JSON Guide

यह JSON किसी भी **deleted / archived item** को store करने के लिए है,  
ताकि बाद में उसे restore किया जा सके।  

हर बार जब inventory, product या अन्य entity delete होती है,  
तो उसकी entry **Recycle Bin** में बनाई जाती है।

---

### `meta` ऑब्जेक्ट  
- `binId` (string): Bin (Trash) में स्टोर किया गया यूनिक ID।  
- `version` (string): स्कीमा वर्ज़न।  
- `status` (string): आइटम की वर्तमान स्थिति — `"deleted"`, `"restored"` आदि।  
- `originalId` (string): जिस मूल (original) आइटम को डिलीट किया गया उसका ID।  
- `originalType` (string): मूल आइटम का प्रकार — `"item"`, `"order"`, `"user"` आदि।  

---

### `audit` ऑब्जेक्ट  
- `deleted` (object): आइटम को डिलीट करने से संबंधित जानकारी।  
  - `reason` (string): डिलीट करने का कारण।  
  - `by` (string): जिसने डिलीट किया उसका ID।  
  - `role` (string): डिलीट करने वाले का रोल — `"merchant"`, `"staff"` आदि।  
  - `at` (string): डिलीट करने की तारीख और समय (ISO 8601 फ़ॉर्मेट)।  
  - `ipAddress` (string): डिलीट करते समय का IP एड्रेस।  
- `restored` (object): आइटम को रिस्टोर करने से संबंधित जानकारी।  
  - `by` (string|null): जिसने रिस्टोर किया उसका ID, या null अगर रिस्टोर नहीं हुआ।  
  - `at` (string|null): रिस्टोर की तारीख और समय, या null अगर रिस्टोर नहीं हुआ। 
  - `role` (string): रिस्टोर करने वाले का रोल — `"merchant"`, `"staff"` आदि।  
  - `ipAddress` (string): रिस्टोर करते समय का IP एड्रेस।  
- `expiresAt` (string): Bin में मौजूद आइटम कब ऑटो-डिलीट होगा (Expiry Date)।