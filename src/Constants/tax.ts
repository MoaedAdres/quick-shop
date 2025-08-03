// Tax configuration constants
// This file centralizes all tax-related configuration
// You can override these values via environment variables or API calls

export const TAX_CONFIG = {
  // Default tax rate (can be overridden by environment variables)
  DEFAULT_TAX_RATE: Number(import.meta.env.VITE_DEFAULT_TAX_RATE) || 0.08, // 8%
  
  // Tax rates by country/region (if needed)
  // These can be fetched from an API or environment variables
  TAX_RATES: {
    US: Number(import.meta.env.VITE_US_TAX_RATE) || 0.08,
    CA: Number(import.meta.env.VITE_CA_TAX_RATE) || 0.13, // Example: Canadian GST + Provincial tax
    UK: Number(import.meta.env.VITE_UK_TAX_RATE) || 0.20, // Example: UK VAT
    EU: Number(import.meta.env.VITE_EU_TAX_RATE) || 0.21, // Example: EU VAT (varies by country)
    // Add more countries as needed
  },
  
  // Tax calculation method
  CALCULATION_METHOD: 'percentage' as const, // or 'fixed', 'tiered', etc.
  
  // Tax exemption thresholds (if applicable)
  EXEMPTION_THRESHOLDS: {
    US: 0, // No exemption threshold
    CA: 0,
    UK: 0,
    EU: 0,
  },
} as const;

// Helper function to get tax rate based on country/region
export const getTaxRate = (country?: string): number => {
  if (country && TAX_CONFIG.TAX_RATES[country as keyof typeof TAX_CONFIG.TAX_RATES]) {
    return TAX_CONFIG.TAX_RATES[country as keyof typeof TAX_CONFIG.TAX_RATES];
  }
  return TAX_CONFIG.DEFAULT_TAX_RATE;
};

// Helper function to calculate tax
export const calculateTax = (subtotal: number, country?: string): number => {
  const taxRate = getTaxRate(country);
  return subtotal * taxRate;
};

// Helper function to format tax rate for display
export const formatTaxRate = (country?: string): string => {
  const rate = getTaxRate(country);
  return `${(rate * 100).toFixed(0)}%`;
};

// Helper function to get tax rate with country name
export const getTaxRateWithCountry = (country?: string): { rate: number; country: string } => {
  const rate = getTaxRate(country);
  const countryName = country || 'Default';
  return { rate, country: countryName };
}; 