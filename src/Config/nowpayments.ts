// NOWPayments Configuration
export const NOWPAYMENTS_CONFIG = {
  // Test mode flag - set to true for testing
  TEST_MODE: import.meta.env.VITE_NOWPAYMENTS_TEST_MODE === 'true' || false,
  
  // API Keys
  API_KEY: import.meta.env.VITE_NOWPAYMENTS_API_KEY || '',
  TEST_API_KEY: import.meta.env.VITE_NOWPAYMENTS_TEST_API_KEY || '',
  
  // Base URLs
  PRODUCTION_URL: 'https://api.nowpayments.io/v1',
  TEST_URL: 'https://api.sandbox.nowpayments.io/v1', // Sandbox URL if available
  
  // Testnet Currencies for testing
  TESTNET_CURRENCIES: [
    {
      id: 'BTC_TEST',
      name: 'Bitcoin Testnet',
      symbol: 'BTC',
      network: 'testnet',
      min_amount: '0.001',
      max_amount: '0.1',
      image_url: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
      test_wallet: 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4'
    },
    {
      id: 'ETH_TEST',
      name: 'Ethereum Testnet',
      symbol: 'ETH',
      network: 'testnet',
      min_amount: '0.01',
      max_amount: '1',
      image_url: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      test_wallet: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
    },
    {
      id: 'MATIC_TEST',
      name: 'Polygon Testnet',
      symbol: 'MATIC',
      network: 'testnet',
      min_amount: '1',
      max_amount: '100',
      image_url: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
      test_wallet: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
    },
    {
      id: 'BSC_TEST',
      name: 'Binance Smart Chain Testnet',
      symbol: 'BNB',
      network: 'testnet',
      min_amount: '0.01',
      max_amount: '1',
      image_url: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
      test_wallet: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
    }
  ],
  
  // Production Currencies (mainnet)
  PRODUCTION_CURRENCIES: [
    {
      id: 'BTC',
      name: 'Bitcoin',
      symbol: 'BTC',
      network: 'mainnet',
      min_amount: '0.001',
      max_amount: '1',
      image_url: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'
    },
    {
      id: 'ETH',
      name: 'Ethereum',
      symbol: 'ETH',
      network: 'mainnet',
      min_amount: '0.01',
      max_amount: '10',
      image_url: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    },
    {
      id: 'MATIC',
      name: 'Polygon',
      symbol: 'MATIC',
      network: 'mainnet',
      min_amount: '1',
      max_amount: '1000',
      image_url: 'https://cryptologos.cc/logos/polygon-matic-logo.png'
    },
    {
      id: 'BNB',
      name: 'Binance Coin',
      symbol: 'BNB',
      network: 'mainnet',
      min_amount: '0.01',
      max_amount: '10',
      image_url: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
    },
    {
      id: 'USDT',
      name: 'Tether',
      symbol: 'USDT',
      network: 'mainnet',
      min_amount: '1',
      max_amount: '10000',
      image_url: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
    },
    {
      id: 'USDC',
      name: 'USD Coin',
      symbol: 'USDC',
      network: 'mainnet',
      min_amount: '1',
      max_amount: '10000',
      image_url: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
    }
  ]
};

// Helper functions
export const getNowPaymentsConfig = () => {
  const isTestMode = NOWPAYMENTS_CONFIG.TEST_MODE;
  
  return {
    isTestMode,
    apiKey: isTestMode ? NOWPAYMENTS_CONFIG.TEST_API_KEY : NOWPAYMENTS_CONFIG.API_KEY,
    baseUrl: isTestMode ? NOWPAYMENTS_CONFIG.TEST_URL : NOWPAYMENTS_CONFIG.PRODUCTION_URL,
    currencies: isTestMode ? NOWPAYMENTS_CONFIG.TESTNET_CURRENCIES : NOWPAYMENTS_CONFIG.PRODUCTION_CURRENCIES,
    environment: isTestMode ? 'testnet' : 'mainnet'
  };
};

// Get available currencies based on test mode
export const getAvailableCurrencies = () => {
  const config = getNowPaymentsConfig();
  return config.currencies;
};

// Check if a currency is testnet
export const isTestnetCurrency = (currencyId: string) => {
  return NOWPAYMENTS_CONFIG.TESTNET_CURRENCIES.some(currency => currency.id === currencyId);
};

// Get test wallet address for a currency
export const getTestWalletAddress = (currencyId: string) => {
  const testCurrency = NOWPAYMENTS_CONFIG.TESTNET_CURRENCIES.find(currency => currency.id === currencyId);
  return testCurrency?.test_wallet || null;
};
