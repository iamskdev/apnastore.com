// log-helper.js

// Import Firebase (make sure Firebase SDK is already initialized in your project)
import { getFirestore, collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

// Initialize Firestore
const db = getFirestore();

/**
 * Helper: Get device + network + browser + platform details
 */
function getDeviceDetails() {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform || 'unknown';
  const device = /Android/.test(userAgent)
    ? 'mobile'
    : /iPhone|iPad|iPod/.test(userAgent)
    ? 'iOS'
    : /Windows/.test(platform)
    ? 'desktop'
    : 'unknown';

  let browser = "Unknown";
  if (/Chrome/.test(userAgent)) {
    browser = userAgent.match(/Chrome\/[0-9.]*/)?.[0] || "Chrome";
  } else if (/Firefox/.test(userAgent)) {
    browser = userAgent.match(/Firefox\/[0-9.]*/)?.[0] || "Firefox";
  }

  return {
    device,
    platform,
    browser,
    userAgent,
    appVersion: navigator.appVersion,
    network: getNetworkDetails(),
  };
}

/**
 * Helper: Get basic network info like connection type
 */
function getNetworkDetails() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!connection) return "unknown";
  return `${connection.effectiveType.toUpperCase()} (${connection.downlink}Mbps)`;
}

/**
 * Helper: Generate structured log object
 */
async function generateLog({
  meta = {},
  event = {},
  sourceOverrides = {},
  auditOverrides = {},
}) {
  const timestamp = new Date().toISOString();
  const deviceInfo = getDeviceDetails();

  // Try to get geolocation if possible
  let geolocation = {};
  try {
    geolocation = await new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve({ lat: null, lng: null }),
        { timeout: 1000 }
      );
    });
  } catch {
    geolocation = { lat: null, lng: null };
  }

  return {
    meta: {
      ...meta,
      version: 1,
    },
    event: {
      ...event,
      timestamp: timestamp,
      serverTime: serverTimestamp(), // Firestore server timestamp
    },
    source: {
      ...deviceInfo,
      address: null, // Optional: update later with reverse geocoding
      geolocation,
      ipAddress: null, // Optional: Only possible with backend support
      ...sourceOverrides,
    },
    audit: {
      createdAt: timestamp,
      createdBy: "system",
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
      updatedAt: null,
      updatedBy: null,
      ...auditOverrides,
    },
  };
}

/**
 * Push log to Firestore `logs` collection
 */
async function pushLogToFirestore(logData) {
  try {
    const logsRef = collection(db, "logs");
    const docRef = doc(logsRef, logData.meta.logId);
    await setDoc(docRef, logData);
    console.log("Log pushed to Firestore:", docRef.id);
    return docRef.id;
  } catch (err) {
    console.error("Error pushing log:", err);
    throw err;
  }
}

/**
 * Main Logging Function
 */
export async function logEvent({
  meta,
  event,
  source = {},
  audit = {},
}) {
  const structuredLog = await generateLog({
    meta,
    event,
    sourceOverrides: source,
    auditOverrides: audit,
  });
  return await pushLogToFirestore(structuredLog);
}