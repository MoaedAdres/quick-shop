import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, Star } from "lucide-react";
import { useGetSupportedCurrencies } from "@/Api/queriesAndMutations";
import type { SupportedCurrency } from "@/Types/types";

interface CryptoCurrencySelectorProps {
  selectedCurrency?: string;
  onCurrencySelect: (currency: SupportedCurrency) => void;
  className?: string;
}

const CryptoCurrencySelector: React.FC<CryptoCurrencySelectorProps> = ({
  selectedCurrency,
  onCurrencySelect,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: currenciesResponse, isLoading } = useGetSupportedCurrencies();
  const currencies = currenciesResponse?.data || [];

  // Filter currencies based on search term
  const filteredCurrencies = currencies.filter(
    (currency) =>
      currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort currencies: popular first, then alphabetically
  const sortedCurrencies = filteredCurrencies.sort((a, b) => {
    if (a.is_popular && !b.is_popular) return -1;
    if (!a.is_popular && b.is_popular) return 1;
    return a.name.localeCompare(b.name);
  });

  const selectedCurrencyData = currencies.find(
    (c) => c.id === selectedCurrency
  );

  const handleCurrencySelect = (currency: SupportedCurrency) => {
    onCurrencySelect(currency);
    setIsOpen(false);
    setSearchTerm("");
  };

  // Default popular currencies if API doesn't return any
  const defaultCurrencies: SupportedCurrency[] = [
    {
      id: "usdttrc20",
      name: "Tether TRC20",
      symbol: "USDT",
      network: "TRX",
      is_popular: true,
      logo_url: "",
    },
    {
      id: "btc",
      name: "Bitcoin",
      symbol: "BTC",
      network: "BTC",
      is_popular: true,
      logo_url: "",
    },
    {
      id: "eth",
      name: "Ethereum",
      symbol: "ETH",
      network: "ETH",
      is_popular: true,
      logo_url: "",
    },
    {
      id: "usdterc20",
      name: "Tether ERC20",
      symbol: "USDT",
      network: "ETH",
      is_popular: true,
      logo_url: "",
    },
  ];

  const displayCurrencies =
    currencies.length > 0 ? sortedCurrencies : defaultCurrencies;

  return (
    <div className={`relative ${className}`}>
      {/* Selector Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-background border border-border rounded-lg hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          {selectedCurrencyData ? (
            <>
              {selectedCurrencyData.logo_url && (
                <img
                  src={selectedCurrencyData.logo_url}
                  alt={selectedCurrencyData.name}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <div className="text-left">
                <div className="font-medium text-foreground">
                  {selectedCurrencyData.symbol}
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedCurrencyData.name}
                </div>
              </div>
              {selectedCurrencyData.is_popular && (
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              )}
            </>
          ) : (
            <div className="text-muted-foreground">Select a cryptocurrency</div>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground transition-transform ${
            isOpen ? "rotate-180" : ""
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
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-hidden"
          >
            {/* Search */}
            {/* <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search currencies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div> */}

            {/* Currency List */}
            <div className="max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <div className="mt-2 text-sm">Loading currencies...</div>
                </div>
              ) : displayCurrencies.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No currencies found
                </div>
              ) : (
                <div className="py-2">
                  {displayCurrencies.map((currency) => (
                    <motion.button
                      key={currency.id}
                      whileHover={{ backgroundColor: "var(--muted)" }}
                      onClick={() => handleCurrencySelect(currency)}
                      className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-muted transition-colors"
                    >
                      {currency.logo_url && (
                        <img
                          src={currency.logo_url}
                          alt={currency.name}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            {currency.symbol}
                          </span>
                          {currency.is_popular && (
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {currency.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {currency.network} Network
                        </div>
                      </div>
                      {selectedCurrency === currency.id && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default CryptoCurrencySelector;
