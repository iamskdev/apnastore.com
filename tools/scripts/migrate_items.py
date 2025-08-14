import json
import re

def transform_item_data(old_data):
    new_data = []
    for item in old_data:
        new_item = {
            "meta": {
                "itemId": item.get("itemId") or item.get("id"),
                "type": item.get("type"),
                "version": 1.0, # Assuming a default version
                "isAvailable": item.get("status", {}).get("isAvailable", False),
                "isActive": item.get("status", {}).get("isActive", False),
                "isPopular": item.get("status", {}).get("isPopular", False),
                "visibility": item.get("status", {}).get("visibility", "hidden"),
                "isDeleted": item.get("status", {}).get("deleted", False),
                "isArchived": item.get("status", {}).get("archived", False),
                "priority": item.get("status", {}).get("priority", "normal"),
                "currency": item.get("pricing", {}).get("currency", "INR"),
                "pricing": {
                    "mrp": item.get("pricing", {}).get("mrp", 0),
                    "costPrice": item.get("pricing", {}).get("costPrice", 0),
                    "sellingPrice": item.get("pricing", {}).get("sellingPrice", 0),
                    "discount": item.get("pricing", {}).get("discount", 0), # New field, default to 0
                    "discountType": item.get("pricing", {}).get("discountType", "fixed") # New field, default to "fixed"
                },
                "links": {
                    "merchantId": item.get("merchantId"),
                    "categoryId": item.get("categoryId"),
                    "subcategoryId": item.get("subcategoryId"),
                    "brandId": item.get("brandName"), # Mapping brandName to brandId
                    "unitId": item.get("inventory", {}).get("unit") # Mapping unit to unitId
                }
            },
            "info": {
                "name": item.get("name"),
                "sku": item.get("sku"),
                "barcode": {
                    "number": item.get("barcode"),
                    "type": item.get("barcodeType")
                },
                "tags": item.get("tags", []),
                "merchantNote": item.get("adminNote"), # Mapping adminNote to merchantNote
                "descriptions": {
                    "short": item.get("descriptions", {}).get("shortDescription"),
                    "long": item.get("descriptions", {}).get("description")
                },
                "attributes": item.get("attributes", {})
            },
            "policies": {
                "returnPolicy": {
                    "isReturnable": "No return" not in item.get("policies", {}).get("returnPolicy", ""),       
                    "returnWindowDays": 7, # Default value
                    "returnType": "replacement_only" if "replacement only" in item.get("policies", {}).get("returnPolicy", "") else "full_refund", # Default value
                    "conditions": [item.get("policies", {}).get("returnPolicy", "")] if item.get("policies", {}).get("returnPolicy") else []
                },
                "warrantyPolicy": {
                    "isWarrantyAvailable": "Not applicable" not in item.get("policies", {}).get("warranty", ""),
                    "warrantyPeriodMonths": 0, # Default value
                    "warrantyType": None, # Default value
                    "provider": None # Default value
                },
                "exchangePolicy": {
                    "isExchangeable": True, # Default value
                    "exchangeWindowDays": 7, # Default value
                    "conditions": [] # Default value
                },
                "cancellationPolicy": {
                    "isCancellable": True, # Default value
                    "cancellationWindowHours": 24, # Default value
                    "cancellationFeePercent": 0 # Default value
                }
            },
            "media": {
                "thumbnail": item.get("media", {}).get("thumbnail"),
                "images": item.get("media", {}).get("images", []),
                "video": item.get("media", {}).get("video")
            },
            "inventory": {
                "stockQty": item.get("inventory", {}).get("stockQty"),
                "batchId": item.get("inventory", {}).get("batchId"),
                "expiryDate": item.get("inventory", {}).get("expiryDate"),
                "lowStockThreshold": item.get("inventory", {}).get("lowStockThreshold"),
                "isLowStock": item.get("inventory", {}).get("isLowStock", False)
            },
            "logistics": {
                "package": {
                    "weight": {
                        "value": float(re.findall(r'\d+\.?\d*', item.get("attributes", {}).get("weight", "0g"))[0]) if re.findall(r'\d+\.?\d*', item.get("attributes", {}).get("weight", "0g")) else 0,
                        "unit": "g" if "g" in item.get("attributes", {}).get("weight", "") else "kg"
                    },
                    "dimensions": { "l": 0, "w": 0, "h": 0, "unit": "cm" }, # Default values
                    "volume": { "value": 0, "unit": "cm³" }, # Default values
                    "packagingType": item.get("attributes", {}).get("packaging"),
                    "fragile": False, # Default value
                    "temperatureSensitive": False # Default value
                },
                "shipping": {
                    "availableMethods": item.get("delivery", {}).get("deliveryModes", []),
                    "defaultMethod": item.get("delivery", {}).get("defaultDeliveryMode"),
                    "estimatedDays": { "min": 0, "max": 0 }, # Default values
                    "charges": { "value": 0, "currency": "INR" }, # Default values
                    "freeShippingThreshold": { "value": 0, "currency": "INR" }, # Default values
                    "codAvailable": True, # Default value
                    "deliveryZones": [] # Default value
                },
                "handling": {
                    "handlingTimeHours": 0, # Default value
                    "specialInstructions": "" # Default value
                }
            },
            "delivery": {
                "modes": item.get("delivery", {}).get("deliveryModes", []),
                "defaultMode": item.get("delivery", {}).get("defaultDeliveryMode")
            },
            "analytics": item.get("analytics", {}),
            "seo": {
                "title": item.get("meta", {}).get("title"),
                "keywords": item.get("meta", {}).get("keywords", []),
                "description": item.get("meta", {}).get("description")
            },
            "audit": {
                "version": item.get("audit", {}).get("version"),
                "createdBy": {
                    "userId": item.get("audit", {}).get("createdBy"),
                    "role": "merchant", # Default role
                    "name": "" # No direct mapping, default empty
                },
                "updatedBy": {
                    "userId": item.get("audit", {}).get("updatedBy"),
                    "role": "merchant", # Default role
                    "name": "" # No direct mapping, default empty
                },
                "createdAt": item.get("audit", {}).get("createdAt"),
                "updatedAt": item.get("audit", {}).get("updatedAt")
            }
        }
        new_data.append(new_item)
    return new_data

# Read old data
with open("s:/My Projects/Apna Store/ApnaStoreV3.3/localstore/jsons/items.old.json", "r") as f:
    old_items_data = json.load(f)

# Transform data
transformed_items_data = transform_item_data(old_items_data)

# Write to new file
with open("s:/My Projects/Apna Store/ApnaStoreV3.3/localstore/jsons/items.json", "w") as f:
    json.dump(transformed_items_data, f, indent=2)

print("Data migration complete from items.old.json to items.json.")