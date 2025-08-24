import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Globe } from 'lucide-react';
import { ALIEXPRESS_COUNTRIES, searchCountries, type AliExpressCountry } from '@/Constants/aliexpressCountries';

interface CountrySelectorProps {
  selectedCountry?: string;
  onCountrySelect: (country: AliExpressCountry) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountry,
  onCountrySelect,
  placeholder = "Select your country",
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCountryData = useMemo(() => {
    if (!selectedCountry) return null;
    return ALIEXPRESS_COUNTRIES.find(country => country.code === selectedCountry);
  }, [selectedCountry]);

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) {
      return ALIEXPRESS_COUNTRIES
    }
    return searchCountries(searchQuery);
  }, [searchQuery]);

  const handleCountrySelect = (country: AliExpressCountry) => {
    onCountrySelect(country);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchQuery("");
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Selected Country Display */}
      <motion.button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-0  disabled:opacity-50 disabled:cursor-not-allowed ring-0`}
      >
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          {selectedCountryData ? (
            <span className="text-sm">
              {selectedCountryData.name} ({selectedCountryData.code})
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-muted-foreground transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-80 overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm  rounded-md bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  autoFocus
                />
              </div>
            </div>

            {/* Countries List */}
            <div className="max-h-60 overflow-y-auto">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <motion.button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-muted/50 transition-colors ${
                      selectedCountry === country.code ? 'bg-primary/10 text-primary' : 'text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-sm flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {country.code}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{country.name}</div>
                        {country.currency && (
                          <div className="text-xs text-muted-foreground">
                            {country.currency}
                          </div>
                        )}
                      </div>
                    </div>
                    {selectedCountry === country.code && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </motion.button>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-muted-foreground">
                  No countries found
                </div>
              )}
            </div>

            {/* Footer with count */}
            {filteredCountries.length > 0 && (
              <div className="px-3 py-2 text-xs text-muted-foreground border-t border-border bg-muted/30">
                {filteredCountries.length} country{filteredCountries.length !== 1 ? 'ies' : 'y'} found
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CountrySelector;
