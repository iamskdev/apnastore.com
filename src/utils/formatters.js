/**
 * @file Centralized utility functions for formatting data like dates, currency, etc.
 */

/**
 * Formats an ISO 8601 date string into a user-friendly format for the India timezone (IST).
 * @param {string} isoString - The date string in ISO format (e.g., "2024-08-21T10:30:00Z").
 * @returns {string} The formatted date string (e.g., "Aug 21, 2024, 4:00:00 PM") or an empty string if input is invalid.
 */
export function formatDateForIndia(isoString) {
  if (!isoString || typeof isoString !== 'string') return '';
  try {
    const date = new Date(isoString);
    const options = {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: true, timeZone: 'Asia/Kolkata'
    };
    return new Intl.DateTimeFormat('en-IN', options).format(date);
  } catch (error) {
    console.error("Error formatting date:", isoString, error);
    return isoString; // Fallback to original string on error
  }
}

/**
 * Formats an E.164 phone number into a more readable format with a space.
 * Specifically handles the +91 country code for now.
 * @param {string} e164Phone - The phone number in E.164 format (e.g., "+919876543210").
 * @returns {string} The formatted phone number (e.g., "+91 9876543210") or the original string.
 */
export function formatPhoneNumberWithSpace(e164Phone) {
  if (!e164Phone || typeof e164Phone !== 'string') return '';
  if (e164Phone.startsWith('+91') && e164Phone.length > 3) {
    return `+91 ${e164Phone.substring(3)}`;
  }
  return e164Phone; // Return original if it's not an Indian number or is too short
}
