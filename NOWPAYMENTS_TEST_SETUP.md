# NOWPayments Test Mode Setup Guide

This guide explains how to set up and use NOWPayments test mode for safe cryptocurrency payment testing, similar to Stripe's test mode.

## 🚀 **Overview**

NOWPayments provides testnet environments for testing cryptocurrency payments without using real funds. This allows you to:

- Test the complete payment flow safely
- Verify payment status updates
- Test different cryptocurrencies
- Debug payment issues
- No risk of losing real funds

## 🔧 **Setup Instructions**

### 1. **Environment Variables**

Add these variables to your `.env` file:

```env
# NOWPayments Configuration
VITE_NOWPAYMENTS_TEST_MODE=true
VITE_NOWPAYMENTS_API_KEY=your_production_api_key
VITE_NOWPAYMENTS_TEST_API_KEY=your_test_api_key
```

### 2. **API Keys**

#### **Production API Key**
- Get your production API key from [NOWPayments Dashboard](https://nowpayments.io/dashboard)
- Used for real transactions in production

#### **Test API Key**
- Use the same API key for testing (NOWPayments doesn't have separate test keys)
- Test mode is controlled by using testnet currencies

### 3. **Test Mode Toggle**

The test mode can be controlled in two ways:

#### **Environment Variable (Recommended)**
```env
VITE_NOWPAYMENTS_TEST_MODE=true  # Enable test mode
VITE_NOWPAYMENTS_TEST_MODE=false # Disable test mode
```

#### **Admin Dashboard Toggle**
- Access the admin dashboard
- Use the "NOWPayments Test Mode" toggle
- This allows runtime switching without code changes

## 🧪 **Available Testnet Currencies**

When test mode is enabled, the following testnet currencies are available:

| Currency | Symbol | Network | Test Wallet Address |
|----------|--------|---------|-------------------|
| Bitcoin Testnet | BTC | testnet | `tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4` |
| Ethereum Testnet | ETH | testnet | `0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6` |
| Polygon Testnet | MATIC | testnet | `0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6` |
| BSC Testnet | BNB | testnet | `0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6` |

## 🔄 **Testing Workflow**

### 1. **Enable Test Mode**
```env
VITE_NOWPAYMENTS_TEST_MODE=true
```

### 2. **Start the Application**
```bash
npm run dev
# or
pnpm dev
```

### 3. **Navigate to Crypto Checkout**
- Go to cart → checkout → select crypto payment
- You'll see a "Test Mode" indicator

### 4. **Select Testnet Currency**
- Choose any testnet currency (BTC_TEST, ETH_TEST, etc.)
- Test wallet addresses are automatically used

### 5. **Complete Test Payment**
- Use the provided test wallet address
- Send testnet coins to complete the payment
- Monitor payment status updates

## 🛠 **Test Wallet Setup**

### **Bitcoin Testnet**
1. Install a Bitcoin testnet wallet (e.g., Electrum)
2. Switch to testnet mode
3. Get testnet BTC from a faucet:
   - [Bitcoin Testnet Faucet](https://testnet-faucet.mempool.co/)
   - [Coinfaucet](https://coinfaucet.eu/en/btc-testnet/)

### **Ethereum Testnet**
1. Use MetaMask or similar wallet
2. Add testnet network (Sepolia, Goerli, etc.)
3. Get testnet ETH from faucets:
   - [Sepolia Faucet](https://sepoliafaucet.com/)
   - [Goerli Faucet](https://goerlifaucet.com/)

### **Polygon Testnet**
1. Add Polygon Mumbai testnet to your wallet
2. Get testnet MATIC from:
   - [Polygon Faucet](https://faucet.polygon.technology/)

## 📊 **Payment Status Testing**

Test different payment scenarios:

| Status | Description | Test Method |
|--------|-------------|-------------|
| `waiting` | Payment created, waiting for funds | Create payment, don't send funds |
| `confirming` | Payment received, confirming | Send small amount, wait for confirmations |
| `confirmed` | Payment confirmed on blockchain | Wait for required confirmations |
| `finished` | Payment completed successfully | Complete full payment amount |
| `failed` | Payment failed or expired | Let payment expire or send wrong amount |
| `expired` | Payment time limit exceeded | Wait for payment to expire |

## 🔍 **Monitoring & Debugging**

### **Payment Status Polling**
The app automatically polls payment status every 5 seconds when a payment is active.

### **Test Mode Indicators**
- Orange test tube icon (🧪) on testnet currencies
- "Test Mode" banner in crypto selector
- Test wallet addresses displayed

### **Console Logging**
Check browser console for:
- Payment creation logs
- Status update logs
- Error messages

## 🚨 **Important Notes**

### **Test Mode Safety**
- ✅ No real funds are at risk
- ✅ Testnet transactions are free
- ✅ Can test all payment scenarios
- ✅ Safe for development and testing

### **Limitations**
- ⚠️ Testnet networks may be slower
- ⚠️ Some features may differ from mainnet
- ⚠️ Testnet faucets have rate limits

### **Production Deployment**
Before going live:
1. Set `VITE_NOWPAYMENTS_TEST_MODE=false`
2. Use production API key
3. Test with small amounts first
4. Verify all payment flows work

## 🔗 **Useful Resources**

- [NOWPayments API Documentation](https://documenter.getpostman.com/view/7907941/2s93JusNJt)
- [Bitcoin Testnet Guide](https://bitcoin.org/en/bitcoin-core/features/development)
- [Ethereum Testnet Guide](https://ethereum.org/en/developers/docs/networks/)
- [Polygon Testnet Guide](https://docs.polygon.technology/docs/develop/network-details/network)

## 🆘 **Troubleshooting**

### **Common Issues**

1. **Payment not detected**
   - Verify testnet network is correct
   - Check wallet address format
   - Ensure sufficient confirmations

2. **Status not updating**
   - Check API key configuration
   - Verify webhook setup (if using)
   - Check network connectivity

3. **Testnet coins not received**
   - Try different faucets
   - Wait for faucet processing
   - Check wallet network settings

### **Support**
For NOWPayments-specific issues:
- [NOWPayments Support](https://nowpayments.io/support)
- [API Documentation](https://documenter.getpostman.com/view/7907941/2s93JusNJt)

---

**Happy Testing! 🎉**
