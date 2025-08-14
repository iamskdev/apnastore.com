// To cache the card template to avoid fetching it multiple times
let cardTemplate = null;

/**
 * Fetches and caches the item card HTML template from the components directory.
 * @returns {Promise<string>} A promise that resolves to the HTML template string.
 */
async function getCardTemplate() {
  if (cardTemplate) {
    return cardTemplate;
  }
  try {
    // Fetch the reusable card component HTML
    const response = await fetch(null);
    if (!response.ok) {
      throw new Error(`Failed to fetch card template: ${response.statusText}`);
    }
    cardTemplate = await response.text();
    return cardTemplate;
  } catch (error) {
    console.error('Error loading card template:', error);
    // Provide a fallback error message if the template fails to load
    return '<a class="item-card" style="color: red;">Could not load item card.</a>';
  }
}

/**
 * Creates a populated HTML string for an item card using a template.
 * This function takes an item object from `items.json`, fetches a card template,
 * and injects the item's data into the template's placeholders, following the
 * correct data schema.
 *
 * @param {object} item - The item data object, conforming to the schema in `items.json`.
 * @returns {Promise<string>} A promise that resolves to the complete HTML string of the populated card.
 */
export async function createItemCard(item) {
  // Validate that the item object and its core identifier exist.
  if (!item || !item.meta?.itemId) {
    console.error("createItemCard: Invalid or incomplete item data provided.", item);
    return ''; // Return empty string if item data is invalid
  }

  const template = await getCardTemplate();

  // --- Data Extraction with correct paths from items.json schema ---
  const id = item.meta.itemId;
  const type = item.meta.type;
  const name = item.info?.name || 'Unnamed Item';
  const description = item.info?.descriptions?.short || '';
  const image = item.media?.thumbnail; // Use thumbnail for card view
  const price = item.pricing?.sellingPrice?.toFixed(2) || '0.00';

  // The `unit` is stored as `unitId` and requires a separate lookup.
  // For this helper, we will use a generic placeholder.
  const unit = 'unit'; // Placeholder

  // Determine stock/availability status based on item type and flags.
  const isAvailable = item.meta?.flags?.isActive && (type === 'service' || (item.inventory?.stockQty > 0));
  const stockStatusClass = isAvailable ? 'in' : 'out';
  const stockStatusText = isAvailable ? (type === 'service' ? 'Available' : 'In Stock') : (type === 'service' ? 'Unavailable' : 'Out of Stock');

  // Define default images based on item type.
  const defaultImage = type === 'service' ? '/src/shared/assets/images/mock-images/default-service.jpg' : '/src/shared/assets/images/mock-images/default-product.jpg';

  // Construct the link to the item details page.
  const href = `/public/pages/item-details.html?id=${id}`;

  // --- Template Population ---
  // Replace all placeholders in the template with the extracted data.
  return template.replace(/{{HREF}}/g, href).replace(/{{IMAGE_SRC}}/g, image || defaultImage).replace(/{{DEFAULT_IMAGE_SRC}}/g, defaultImage).replace(/{{ITEM_NAME}}/g, name).replace(/{{PRICE}}/g, price).replace(/{{UNIT}}/g, unit).replace(/{{STOCK_CLASS}}/g, stockStatusClass).replace(/{{STOCK_TEXT}}/g, stockStatusText).replace(/{{DESCRIPTION}}/g, description);
}

