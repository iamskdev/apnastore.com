```json
{
  "meta": {
    "userId": "USR00000001",
    "roles": ["admin"],
    "registeredOn": "2024-06-12T00:00:00Z",
    "platforms": ["android"],
    "device": "mobile",
    "version": 1.0,
    "lastUpdated": "2024-06-15T10:00:00Z",
    "settings": {"language": "en", "currency": "INR", "theme": "dark", "notifications": true},
    "links": {
      "myBusinessIds": [],
      "myRoleIds": [],
      "myStaffIds": []
    },

    "flags": {
      "isAdmin": true,    
      "isMerchant": false,      
      "haveStaff": false,      
      "isCustomer": false,      
      "isAgent": false,         
      "isStaff": false,          
      "isSuspended": false
    },

    "isActive": true,
    "isVerified": true,
    "emailVerified": true,
    "phoneVerified": true,
    "kycStatus": "verified"
  },
  "info": {
    "fullName": "Santosh Kumar",
    "nickName": "Mr. Santosh",
    "gender": "male",
    "dob": "1988-04-10",
    "avatar": "/localstore/Images/users/dev.png",
    "tagline": "Top Contributor",
    "bio": "Passionate developer & tech enthusiast",
    "email": "dev@apnastore.io",
    "phone": "+91 9634557007"
  },
  "auth": {
    "type": "password",
    "passwordHash": "hashed_password_here",
    "passwordUpdatedAt": "2024-06-01T12:00:00Z",
    "fcmToken": "abcdef123456",
    "twoFactorEnabled": false,
    "twoFactorMethod": null,
    "recoveryEmail": "recovery@example.com",
    "recoveryPhone": "+91 9876543210",
    "securityQuestions": [
      {
        "question": "Your first pet's name?",
        "answerHash": "hash_here"
      }
    ],
    "loginAttempts": 1,
    "lastLogin": "2024-06-15T10:00:00Z",
    "lastFailedLogin": "2024-06-10T08:00:00Z",
    "accountLockedUntil": null,
    "deviceHistory": [
      {
        "device": "Samsung M12",
        "ip": "192.168.1.2",
        "lastUsed": "2024-06-15T10:00:00Z"
      },
      {
        "device": "iPhone 12",
        "ip": "192.168.2.5",
        "lastUsed": "2024-06-14T08:20:00Z"
      }
    ],
    "sessions": [
      {
        "accountId": "sess_001",
        "createdAt": "2024-06-15T10:00:00Z",
        "lastActivity": "2024-06-15T12:00:00Z"
      }
    ]
  },
"address": [
  {
    "label": "Home",
    "isPrimary": true,
    "street": "Durgapur",
    "city": "Chas",
    "district": "Bokaro",
    "state": "Jharkhand",
    "country": "India",
    "zipCode": "827013",
    "geoLocation": { "lat": 23.6345, "lng": 86.1679 }
  },
  {
    "label": "Work",
    "street": "Tech Park",
    "city": "Ranchi",
    "district": "Ranchi",
    "state": "Jharkhand",
    "country": "India",
    "zipCode": "834001",
    "geoLocation": { "lat": 23.3700, "lng": 85.3250 }
  }
],
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
----
# 🧾 User JSON Structure

यह डॉक्यूमेंट `User JSON Schema` का विवरण देता है, जिसमें user की identity, roles, linked entities, flags और अन्य meta जानकारी शामिल है।

---

## 1. `meta` — User Metadata
यूज़र की पहचान, roles, linking और status की सभी जानकारी रखता है।

- `userId`: यूनिक यूज़र ID  
- `roles`: यूज़र की भूमिकाएँ, जैसे `super-admin`, `customer`, `merchant`  
- `registeredOn`: अकाउंट रजिस्ट्रेशन तारीख  
- `platforms`: प्लेटफ़ॉर्म्स जहाँ यूज़र ने लॉगिन किया, जैसे `android`, `ios`  
- `device`: डिवाइस प्रकार — `mobile`, `desktop`  
- `version` (string): स्कीमा या डेटा स्ट्रक्चर का वर्ज़न।  
- `lastUpdated`: आख़िरी प्रोफ़ाइल अपडेट का समय  
-  `settings` : user ka setting backup
    - `language` (string): UI की भाषा।  
    - `currency` (string): ऐप में दिखाई जाने वाली मुद्रा।  
    - `theme` (string): UI थीम — `"light"`, `"dark"`, `"system"`।  
    - `notifications`** (boolean): Push और in‑app notifications की अनुमति (`true` = चालू, `false` = बंद)।
---

### `links` — Connected Entities
ये IDs सिर्फ़ references हैं, actual data अलग collections में रहेगा।  
- `myBusinessIds`: इस यूज़र के खुद के business (merchant) IDs  
- `myStaffIds`: इस यूज़र के द्वारा employ किए गए staff IDs  
- `myRoleIds`: इस यूज़र ko kisi ne assigned role IDs diya h (staff, agent आदि)  

---

### `flags` — Quick Role Indicators
तेज़ी से पहचानने के लिए boolean flags:  
- `isAdmin`: क्या यूज़र super-admin है  
- `isMerchant`: क्या यूज़र merchant है  
- `haveStaff`: क्या यूज़र के पास staff है  
- `isCustomer`: क्या यूज़र customer है  
- `isAgent`: क्या यूज़र agent है  
- `isStaff`: क्या यूज़र किसी और के staff के रूप में linked है  

---

### Status Flags
- `isActive`: क्या अकाउंट सक्रिय है  
- `isVerified`: क्या अकाउंट वेरीफ़ाइड है  
- `emailVerified`: क्या ईमेल सत्यापित है  
- `phoneVerified`: क्या फ़ोन सत्यापित है  
- `kycStatus`: KYC की स्थिति — `verified`, `pending`, `rejected`  

---

## 2. `info` — User Information
यूज़र की व्यक्तिगत जानकारी।

- `fullName`: पूरा नाम  
- `nickName`: उपनाम  
- `gender`: `male`, `female`, `other`  
- `dob`: जन्मतिथि  
- `avatar`: प्रोफ़ाइल तस्वीर का URL  
- `tagline`: छोटा टैगलाइन  
- `bio`: व्यक्तिगत विवरण  
- `email`: ईमेल पता  
- `phone`: फ़ोन नंबर  

---

## 3. `auth` — Authentication & Security
यूज़र के लॉगिन और सुरक्षा विवरण।

- `type`: लॉगिन प्रकार — `password`, `oauth`  
- `passwordHash`: पासवर्ड का हैश  
- `passwordUpdatedAt`: आख़िरी बार पासवर्ड बदला गया समय  
- `fcmToken`: पुश नोटिफ़िकेशन के लिए FCM टोकन  
- `twoFactorEnabled`: टू‑फैक्टर ऑथेंटिकेशन चालू है या नहीं  
- `twoFactorMethod`: टू‑फैक्टर का तरीका — `sms`, `app` आदि  
- `recoveryEmail`: रिकवरी ईमेल  
- `recoveryPhone`: रिकवरी फ़ोन नंबर  
- `securityQuestions`: सुरक्षा प्रश्न और उनके हैश किए गए उत्तर  
- `loginAttempts`: लगातार असफल लॉगिन प्रयासों की संख्या  
- `lastLogin`: आख़िरी सफल लॉगिन समय  
- `lastFailedLogin`: आख़िरी असफल लॉगिन समय  
- `accountLockedUntil`: अकाउंट लॉक रहने तक का समय  
- `deviceHistory`: पहले इस्तेमाल किए गए डिवाइस और IP की लिस्ट  
- `sessions`: सक्रिय सेशन्स की जानकारी  

---

## 4. `address` — Saved Addresses
यूज़र के सेव किए गए पते।

प्रत्येक पता:  
- `label`: पते का लेबल — `Home`, `Work`  
- `isPrimary`: क्या यह प्राथमिक पता है  
- `street`: सड़क / इलाका  
- `city`: शहर  
- `district`: ज़िला  
- `state`: राज्य  
- `country`: देश  
- `zipCode`: पिन कोड  
- `geoLocation`: लोकेशन के `lat` और `lng`  

---

## 5. `subscription` — Subscription Details
यूज़र के सब्सक्रिप्शन की जानकारी।

- `plan`: प्लान का नाम — `Premium`, `Basic`  
- `type`: `Monthly`, `Yearly`  
- `startDate`: सब्सक्रिप्शन शुरू होने की तारीख  
- `endDate`: समाप्ति की तारीख  
- `status`: `active`, `expired`, `cancelled`  
- `autoRenew`: क्या ऑटो रिन्यू सक्षम है  
- `amount`: प्लान की कीमत
----
# 🧾 User JSON Structure

यह डॉक्यूमेंट `User JSON Schema` का विवरण देता है, जिसमें user की identity, roles, linked entities, flags और अन्य meta जानकारी शामिल है।

---

## 1. `meta` — User Metadata
यूज़र की पहचान, roles, linking और status की सभी जानकारी रखता है।

- `userId`: यूनिक यूज़र ID  
- `roles`: यूज़र की भूमिकाएँ, जैसे `super-admin`, `customer`, `merchant`  
- `registeredOn`: अकाउंट रजिस्ट्रेशन तारीख  
- `platforms`: प्लेटफ़ॉर्म्स जहाँ यूज़र ने लॉगिन किया, जैसे `android`, `ios`  
- `device`: डिवाइस प्रकार — `mobile`, `desktop`  
- `version` (string): स्कीमा या डेटा स्ट्रक्चर का वर्ज़न।  
- `lastUpdated`: आख़िरी प्रोफ़ाइल अपडेट का समय  
-  `settings` : user ka setting backup
    - `language` (string): UI की भाषा।  
    - `currency` (string): ऐप में दिखाई जाने वाली मुद्रा।  
    - `theme` (string): UI थीम — `"light"`, `"dark"`, `"system"`।  
    - `notifications`** (boolean): Push और in‑app notifications की अनुमति (`true` = चालू, `false` = बंद)।
---

### `links` — Connected Entities
ये IDs सिर्फ़ references हैं, actual data अलग collections में रहेगा।  
- `myBusinessIds`: इस यूज़र के खुद के business (merchant) IDs  
- `myStaffIds`: इस यूज़र के द्वारा employ किए गए staff IDs  
- `myRoleIds`: इस यूज़र ko kisi ne assigned role IDs diya h (staff, agent आदि)  

---

### `flags` — Quick Role Indicators
तेज़ी से पहचानने के लिए boolean flags:  
- `isAdmin`: क्या यूज़र super-admin है  
- `isMerchant`: क्या यूज़र merchant है  
- `haveStaff`: क्या यूज़र के पास staff है  
- `isCustomer`: क्या यूज़र customer है  
- `isAgent`: क्या यूज़र agent है  
- `isStaff`: क्या यूज़र किसी और के staff के रूप में linked है  

---

### Status Flags
- `isActive`: क्या अकाउंट सक्रिय है  
- `isVerified`: क्या अकाउंट वेरीफ़ाइड है  
- `emailVerified`: क्या ईमेल सत्यापित है  
- `phoneVerified`: क्या फ़ोन सत्यापित है  
- `kycStatus`: KYC की स्थिति — `verified`, `pending`, `rejected`  

---

## 2. `info` — User Information
यूज़र की व्यक्तिगत जानकारी।

- `fullName`: पूरा नाम  
- `nickName`: उपनाम  
- `gender`: `male`, `female`, `other`  
- `dob`: जन्मतिथि  
- `avatar`: प्रोफ़ाइल तस्वीर का URL  
- `tagline`: छोटा टैगलाइन  
- `bio`: व्यक्तिगत विवरण  
- `email`: ईमेल पता  
- `phone`: फ़ोन नंबर  

---

## 3. `auth` — Authentication & Security
यूज़र के लॉगिन और सुरक्षा विवरण।

- `type`: लॉगिन प्रकार — `password`, `oauth`  
- `passwordHash`: पासवर्ड का हैश  
- `passwordUpdatedAt`: आख़िरी बार पासवर्ड बदला गया समय  
- `fcmToken`: पुश नोटिफ़िकेशन के लिए FCM टोकन  
- `twoFactorEnabled`: टू‑फैक्टर ऑथेंटिकेशन चालू है या नहीं  
- `twoFactorMethod`: टू‑फैक्टर का तरीका — `sms`, `app` आदि  
- `recoveryEmail`: रिकवरी ईमेल  
- `recoveryPhone`: रिकवरी फ़ोन नंबर  
- `securityQuestions`: सुरक्षा प्रश्न और उनके हैश किए गए उत्तर  
- `loginAttempts`: लगातार असफल लॉगिन प्रयासों की संख्या  
- `lastLogin`: आख़िरी सफल लॉगिन समय  
- `lastFailedLogin`: आख़िरी असफल लॉगिन समय  
- `accountLockedUntil`: अकाउंट लॉक रहने तक का समय  
- `deviceHistory`: पहले इस्तेमाल किए गए डिवाइस और IP की लिस्ट  
- `sessions`: सक्रिय सेशन्स की जानकारी  

---

## 4. `address` — Saved Addresses
यूज़र के सेव किए गए पते।

प्रत्येक पता:  
- `label`: पते का लेबल — `Home`, `Work`  
- `isPrimary`: क्या यह प्राथमिक पता है  
- `street`: सड़क / इलाका  
- `city`: शहर  
- `district`: ज़िला  
- `state`: राज्य  
- `country`: देश  
- `zipCode`: पिन कोड  
- `geoLocation`: लोकेशन के `lat` और `lng`  

---

## 5. `subscription` — Subscription Details
यूज़र के सब्सक्रिप्शन की जानकारी।

- `plan`: प्लान का नाम — `Premium`, `Basic`  
- `type`: `Monthly`, `Yearly`  
- `startDate`: सब्सक्रिप्शन शुरू होने की तारीख  
- `endDate`: समाप्ति की तारीख  
- `status`: `active`, `expired`, `cancelled`  
- `autoRenew`: क्या ऑटो रिन्यू सक्षम है  
- `amount`: प्लान की कीमत