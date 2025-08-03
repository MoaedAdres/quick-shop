# Tax Configuration

## Overview
The tax calculation system has been made configurable to support different tax rates by country/region.

## Current Implementation

### Default Tax Rate
- **Default**: 8% (0.08)
- **Location**: `src/Constants/tax.ts`
- **Usage**: Applied when no specific country tax rate is available

### Country-Specific Tax Rates
Currently configured for:
- **US**: 8% (0.08)
- **CA**: 13% (0.13) - Canadian GST + Provincial tax
- **UK**: 20% (0.20) - UK VAT
- **EU**: 21% (0.21) - EU VAT (varies by country)

## Configuration Options

### 1. Environment Variables
You can override tax rates using environment variables:

```bash
# Default tax rate
VITE_DEFAULT_TAX_RATE=0.08

# Country-specific rates
VITE_US_TAX_RATE=0.08
VITE_CA_TAX_RATE=0.13
VITE_UK_TAX_RATE=0.20
VITE_EU_TAX_RATE=0.21
```

### 2. Direct Code Modification
Edit `src/Constants/tax.ts` to change tax rates:

```typescript
TAX_RATES: {
  US: 0.08,
  CA: 0.13,
  UK: 0.20,
  EU: 0.21,
  // Add more countries
}
```

### 3. API Integration (Future)
You can extend the system to fetch tax rates from an API:

```typescript
// Example: Fetch tax rates from API
const fetchTaxRate = async (country: string): Promise<number> => {
  const response = await fetch(`/api/tax-rates/${country}`);
  const data = await response.json();
  return data.taxRate;
};
```

## Usage in Components

### Checkout Component
```typescript
import { calculateTax } from "@/Constants/tax";

const calculateCartTotals = () => {
  const subtotal = /* calculate subtotal */;
  const country = shippingAddress?.country;
  const tax = calculateTax(subtotal, country);
  // ...
};
```

### Order Summary Modal
```typescript
import { formatTaxRate } from "@/Constants/tax";

// Display dynamic tax rate
<span>Tax ({formatTaxRate(shippingAddress.country)})</span>
```

## Adding New Countries

1. Add the country code to `TAX_RATES` in `src/Constants/tax.ts`
2. Optionally add an environment variable
3. The system will automatically use the new rate when the country is detected

## Business Logic Considerations

### When to Apply Tax
- **Digital Products**: May have different tax rules
- **Physical Products**: Tax based on shipping address
- **Services**: May have different tax rates
- **Exemptions**: Consider tax exemption thresholds

### Tax Calculation Methods
Currently supports:
- **Percentage**: `subtotal * taxRate`
- **Future**: Fixed amount, tiered rates, etc.

## Testing
Test different tax rates by:
1. Changing environment variables
2. Modifying the `TAX_RATES` object
3. Testing with different shipping addresses

## Notes
- The 8% rate was previously hardcoded in multiple places
- Now centralized in `src/Constants/tax.ts`
- Supports dynamic tax rates based on shipping country
- Environment variables allow for easy configuration
- Extensible for future tax calculation methods 