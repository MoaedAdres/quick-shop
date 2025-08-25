import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Star, Search } from "lucide-react";
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
  // Helper function to get gradient colors based on currency
  const getCurrencyGradient = (code: string) => {
    const gradients = [
      "from-blue-500 to-purple-500",
      "from-green-500 to-teal-500", 
      "from-orange-500 to-red-500",
      "from-purple-500 to-pink-500",
      "from-yellow-500 to-orange-500",
      "from-indigo-500 to-blue-500",
      "from-emerald-500 to-green-500",
      "from-rose-500 to-pink-500"
    ];
    
    // Use the first character of the code to determine gradient
    const index = code.charCodeAt(0) % gradients.length;
    return gradients[index];
  };
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: currenciesResponse, isLoading } = useGetSupportedCurrencies();
  const currencies: SupportedCurrency[] = currenciesResponse?.data?.currencies || [];
  // Filter currencies based on search term
  const filteredCurrencies = currencies.filter(
    (currency) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        currency.name.toLowerCase().includes(searchLower) ||
        currency.code.toLowerCase().includes(searchLower) ||
        currency.ticker?.toLowerCase().includes(searchLower) ||
        currency.network?.toLowerCase().includes(searchLower)
      );
    }
  );

  // Sort currencies: popular first, then alphabetically
  const sortedCurrencies = filteredCurrencies.sort((a, b) => {
    if (a.is_popular && !b.is_popular) return -1;
    if (!a.is_popular && b.is_popular) return 1;
    return a.name.localeCompare(b.name);
  });

  const selectedCurrencyData = currencies.find(
    (c) => c.code === selectedCurrency
  );

  const handleCurrencySelect = (currency: SupportedCurrency) => {
    onCurrencySelect(currency);
    setIsOpen(false);
    setSearchTerm("");
  };

  // Default popular currencies if API doesn't return any
  const defaultCurrencies: SupportedCurrency[] = [
    {
      id: 1,
      code: "USDTTRC20",
      name: "Tether TRC20",
      enable: true,
      wallet_regex: "^T[1-9A-HJ-NP-Za-km-z]{33}$",
      priority: 1,
      extra_id_exists: false,
      extra_id_regex: null,
      logo_url: "",
      track: true,
      cg_id: "tether",
      is_maxlimit: false,
      network: "trx",
      smart_contract: null,
      network_precision: null,
      explorer_link_hash: null,
      precision: 8,
      ticker: "usdt",
      is_defi: false,
      is_popular: true,
      is_stable: true,
      available_for_to_conversion: true,
      trust_wallet_id: null,
    },
    {
      id: 2,
      code: "BTC",
      name: "Bitcoin",
      enable: true,
      wallet_regex: "^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^(bc1)[0-9A-Za-z]{39,59}$",
      priority: 0,
      extra_id_exists: false,
      extra_id_regex: null,
      logo_url: "",
      track: true,
      cg_id: "bitcoin",
      is_maxlimit: false,
      network: "btc",
      smart_contract: null,
      network_precision: null,
      explorer_link_hash: null,
      precision: 8,
      ticker: "btc",
      is_defi: false,
      is_popular: true,
      is_stable: false,
      available_for_to_conversion: true,
      trust_wallet_id: null,
    },
    {
      id: 3,
      code: "ETH",
      name: "Ethereum",
      enable: true,
      wallet_regex: "^(0x)[0-9A-Fa-f]{40}$",
      priority: 1,
      extra_id_exists: false,
      extra_id_regex: null,
      logo_url: "",
      track: true,
      cg_id: "ethereum",
      is_maxlimit: false,
      network: "eth",
      smart_contract: null,
      network_precision: null,
      explorer_link_hash: null,
      precision: 8,
      ticker: "eth",
      is_defi: false,
      is_popular: true,
      is_stable: false,
      available_for_to_conversion: true,
      trust_wallet_id: null,
    },
    {
      id: 4,
      code: "USDTERC20",
      name: "Tether ERC20",
      enable: true,
      wallet_regex: "^(0x)[0-9A-Fa-f]{40}$",
      priority: 2,
      extra_id_exists: false,
      extra_id_regex: null,
      logo_url: "",
      track: true,
      cg_id: "tether",
      is_maxlimit: false,
      network: "eth",
      smart_contract: null,
      network_precision: null,
      explorer_link_hash: null,
      precision: 8,
      ticker: "usdt",
      is_defi: false,
      is_popular: true,
      is_stable: true,
      available_for_to_conversion: true,
      trust_wallet_id: null,
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
              <div className={`w-6 h-6 bg-gradient-to-r ${getCurrencyGradient(selectedCurrencyData.code)} rounded-full flex items-center justify-center`}>
                <span className="text-xs font-bold text-white">
                  {selectedCurrencyData.code.charAt(0)}
                </span>
              </div>
              <div className="text-left">
                <div className="font-medium text-foreground">
                  {selectedCurrencyData.code}
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
             <div className="p-3 border-b border-border">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                 <input
                   type="text"
                   placeholder="Search currencies (name, code, network)..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                 />
                 {searchTerm && (
                   <button
                     onClick={() => setSearchTerm("")}
                     className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-foreground"
                   >
                     ×
                   </button>
                 )}
               </div>
               {searchTerm && (
                 <div className="mt-2 text-xs text-muted-foreground">
                   {filteredCurrencies.length} result{filteredCurrencies.length !== 1 ? 's' : ''} found
                 </div>
               )}
             </div>

            {/* Currency List */}
            <div className="max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <div className="mt-2 text-sm">Loading currencies...</div>
                </div>
                             ) : displayCurrencies.length === 0 ? (
                 <div className="p-4 text-center text-muted-foreground">
                   {searchTerm ? `No currencies found for "${searchTerm}"` : "No currencies found"}
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
                      <div className={`w-8 h-8 bg-gradient-to-r ${getCurrencyGradient(currency.code)} rounded-full flex items-center justify-center`}>
                        <span className="text-xs font-bold text-white">
                          {currency.code.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            {currency.code}
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
                      {selectedCurrency === currency.code && (
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
