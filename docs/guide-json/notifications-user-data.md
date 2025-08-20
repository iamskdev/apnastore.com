```json
{
  "meta": {
    "pushNfId": "ALT00000001",
    "version": 1.0,
    "links": { 
      "orderId": "ORD00000001",
      "userId": "USR00000002",

    },  
    "status": {
      "isRead": false,
      "isDeleted": false,
      "isArchived": false
    },
    "delivery": {
      "receivedAt": "2025-08-05T10:01:00Z",
      "readAt": null,
      "clickedAt": null
    },
    "sync": {
      "lastUpdated": "2025-08-05T10:01:00Z",
      "restoredFromBackup": false
    }
  }
}
```
----

## 📌 User Notification JSON Structure (`notification-received`)

यह JSON **यूज़र-लेवल** पर स्टोर होता है और यूज़र के **नोटिफिकेशन स्टेटस** (read/delete/archive) को ट्रैक करता है।  
इसमें नोटिफिकेशन का असली कंटेंट नहीं रखा जाता — सिर्फ **metadata + sync status** ताकि दोबारा लॉगिन या बैकअप restore पर यह स्टेटस वापस मिल जाए।

---

### 1. `meta` Object
- `version` (string): स्कीमा या डेटा स्ट्रक्चर का वर्ज़न।  

- `pushNfId` → यूनिक नोटिफिकेशन ID (master/pushed collection से content fetch करने के लिए)  
- `links` → इस नोटिफिकेशन से जुड़ी IDs  
- `status` → इस नोटिफिकेशन की यूज़र स्टेट (read/delete/archive)  
- `delivery` → डिलीवरी और इंटरैक्शन टाइमस्टैम्प  
- `sync` → बैकअप और sync से जुड़ी जानकारी  

---

### 2. `links` Object
- `orderId` → अगर ऑर्डर से जुड़ा है तो उसका ID, अन्यथा null  
- `userId` → जिस यूज़र को यह नोटिफिकेशन मिला  

---

### 3. `status` Object
- `isRead` → यूज़र ने खोला है या नहीं  
- `isDeleted` → यूज़र ने डिलीट किया या नहीं (soft delete)  
- `isArchived` → आर्काइव किया या नहीं  

---

### 4. `delivery` Object
- `receivedAt` → यूज़र को नोटिफिकेशन कब मिला  
- `readAt` → कब पढ़ा गया (`null` = अभी तक नहीं पढ़ा)  
- `clickedAt` → CTA कब क्लिक हुआ (`null` = अभी तक नहीं क्लिक हुआ)  

---

### 5. `sync` Object
- `lastUpdated` → इस एंट्री को आख़िरी बार कब अपडेट किया गया  
- `restoredFromBackup` → क्या यह बैकअप से restore हुआ है  

---
