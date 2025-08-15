import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CreditCard, Wallet } from "lucide-react";
import { icons } from "@/Constants/icons";
import { useGetCart, useCreateStripeOrder, useCreateCryptoOrder } from "@/Api/queriesAndMutations";
import RFlex from "@/RComponents/RFlex";
import StripePayment from "@/components/ui/stripe-payment";
import CryptoPayment from "@/components/ui/crypto-payment";
import CryptoCurrencySelector from "@/components/ui/crypto-currency-selector";
import ShippingPreviewForm from "@/components/ui/shipping-preview-form";
import OrderSummaryModal from "@/components/ui/order-summary-modal";
import type {
  ShippingPreviewSuccess,
  ShippingPreviewError,
  ShippingAddress,
  SupportedCurrency,
  CryptoPaymentResponse,
} from "@/Types/types";
import { toast } from "sonner";
import { calculateTax } from "@/Constants/tax";

const Checkout = () => {
  const navigate = useNavigate();
  const { data: cartData, isLoading, error } = useGetCart();
  const [shippingPreview, setShippingPreview] =
    useState<ShippingPreviewSuccess | null>(null);
  const [showShippingForm, setShowShippingForm] = useState(true);
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress | null>(null);
  const [showOrderSummaryModal, setShowOrderSummaryModal] = useState(false);
  const [showPaymentMethodSelection, setShowPaymentMethodSelection] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'stripe' | 'crypto' | null>(null);
  const [selectedCryptoCurrency, setSelectedCryptoCurrency] = useState<SupportedCurrency | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [cryptoPaymentData, setCryptoPaymentData] = useState<CryptoPaymentResponse['data'] | null>(null);
  const [orderIds, setOrderIds] = useState<string[]>([]);

  // const formatPrice = (price: number) => {
  //   return new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: "USD",
  //   }).format(price);
  // };

  const calculateCartTotals = () => {
    if (!cartData?.items) return { subtotal: 0, shipping: 0, tax: 0, total: 0 };

    const subtotal = cartData.items.reduce(
      (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
      0
    );
    const shipping = shippingPreview?.data.total_shipping_fee ?? 0;

    // Get tax rate based on shipping address country (if available)
    const country = shippingAddress?.country;
    const tax = calculateTax(subtotal, country);
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };

  const handleShippingSuccess = (preview: ShippingPreviewSuccess) => {
    console.log("preview", preview);
    setShippingPreview(preview);
    setShowOrderSummaryModal(true);
  };

  const handleShippingError = (_: ShippingPreviewError) => {
    setShippingPreview(null);
    toast.error("some items is out of stock or not available in your area");
  };

  const handlePaymentSuccess = () => {
    toast.success(`Payment successful! Your order${orderIds.length > 1 ? 's' : ''} has been placed.`);
    // Navigate to order confirmation or orders page
    navigate("/dashboard/orders");
  };

  const handlePaymentError = (error: string) => {
    toast.error(error);
  };

  const handlePaymentCancel = () => {
    navigate("/dashboard/cart");
  };

  const createStripeOrderMutation = useCreateStripeOrder();
  const createCryptoOrderMutation = useCreateCryptoOrder();

  const handleOrderSummaryContinue = async () => {
    if (!shippingAddress) return;

    setShowOrderSummaryModal(false);
    setShowShippingForm(false);
    setShowPaymentMethodSelection(true);
  };

  const handlePaymentMethodSelect = async (method: 'stripe' | 'crypto') => {
    if (!shippingAddress) return;

    setSelectedPaymentMethod(method);

    if (method === 'stripe') {
      try {
        const result = await createStripeOrderMutation.mutateAsync({
          payment_method: "stripe",
          delivery_address: shippingAddress,
        });

        setStripeClientSecret(result.data.client_secret);
        setOrderIds(result.data.order_ids);
        setShowPaymentMethodSelection(false);
        setShowPaymentForm(true);
      } catch (error) {
        console.error("Failed to create Stripe order:", error);
        toast.error("Failed to initialize payment. Please try again.");
      }
    } else {
      // For crypto, we need to select currency first
      setShowPaymentMethodSelection(false);
      setShowPaymentForm(true);
    }
  };

  const handleCryptoOrderCreate = async () => {
    if (!shippingAddress || !selectedCryptoCurrency) return;

    try {
      const result = await createCryptoOrderMutation.mutateAsync({
        payment_method: "crypto",
        pay_currency: selectedCryptoCurrency.id,
        delivery_address: shippingAddress,
      });

      setCryptoPaymentData(result.data);
      setOrderIds([result.data.order_id]);
      toast.success("Crypto payment session created successfully!");
    } catch (error) {
      console.error("Failed to create crypto order:", error);
      toast.error("Failed to initialize crypto payment. Please try again.");
    }
  };

  const handleOrderSummaryBack = () => {
    setShowOrderSummaryModal(false);
  };

  if (isLoading) {
    return (
      <RFlex className="flex-col h-full pb-20 md:pb-0">
        <div className="bg-card border-b border-border p-4">
          <h1 className="text-xl font-semibold text-foreground">Checkout</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <i
            className={`${icons.spinner} text-2xl text-primary animate-spin`}
          />
        </div>
      </RFlex>
    );
  }

  if (error || !cartData || !cartData.items || cartData.items.length === 0) {
    return (
      <RFlex className="flex-col h-full pb-20 md:pb-0">
        <div className="bg-card border-b border-border p-4">
          <h1 className="text-xl font-semibold text-foreground">Checkout</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <i className={`${icons.error} text-3xl text-red-500 mb-2`} />
            <p className="text-muted-foreground">No items in cart</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard/cart")}
              className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg"
            >
              Back to Cart
            </motion.button>
          </div>
        </div>
      </RFlex>
    );
  }

  const totals = calculateCartTotals();

  return (
    <RFlex className="flex-col h-full pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"
          >
            <i className={`${icons.arrowLeft} text-muted-foreground`} />
          </motion.button>
          <h1 className="text-xl font-semibold text-foreground">Checkout</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Shipping Form */}
          <AnimatePresence>
            {showShippingForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-card border border-border rounded-lg p-6"
              >
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Shipping Information
                </h2>
                <ShippingPreviewForm
                  onSuccess={(preview) => handleShippingSuccess(preview)}
                  onError={handleShippingError}
                  setShippingAddress={setShippingAddress}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Payment Method Selection */}
          <AnimatePresence>
            {showPaymentMethodSelection && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-card border border-border rounded-lg p-6"
              >
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Choose Payment Method
                </h2>
                <div className="space-y-3">
                  {/* Stripe Payment Option */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePaymentMethodSelect('stripe')}
                    disabled={createStripeOrderMutation.isPending}
                    className="w-full flex items-center gap-4 p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-muted/50 transition-colors disabled:opacity-50"
                  >
                    <CreditCard className="w-6 h-6 text-primary" />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-foreground">Credit/Debit Card</div>
                      <div className="text-sm text-muted-foreground">Pay with Visa, Mastercard, American Express</div>
                    </div>
                    {createStripeOrderMutation.isPending && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                    )}
                  </motion.button>

                  {/* Crypto Payment Option */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePaymentMethodSelect('crypto')}
                    className="w-full flex items-center gap-4 p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-muted/50 transition-colors"
                  >
                    <Wallet className="w-6 h-6 text-primary" />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-foreground">Cryptocurrency</div>
                      <div className="text-sm text-muted-foreground">Pay with Bitcoin, USDT, Ethereum, and more</div>
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Payment Section */}
          <AnimatePresence>
            {showPaymentForm && selectedPaymentMethod === 'stripe' && stripeClientSecret && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-card border border-border rounded-lg p-6"
              >
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Credit Card Payment
                </h2>
                <StripePayment
                  clientSecret={stripeClientSecret}
                  amount={totals.total}
                  currency="USD"
                  shippingAddress={shippingAddress!}
                  cartItems={cartData.items}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  onCancel={handlePaymentCancel}
                />
              </motion.div>
            )}

            {showPaymentForm && selectedPaymentMethod === 'crypto' && !cryptoPaymentData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-card border border-border rounded-lg p-6"
              >
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Cryptocurrency Payment
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Select Cryptocurrency
                    </label>
                    <CryptoCurrencySelector
                      selectedCurrency={selectedCryptoCurrency?.id}
                      onCurrencySelect={setSelectedCryptoCurrency}
                    />
                  </div>
                  
                  {selectedCryptoCurrency && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCryptoOrderCreate}
                      disabled={createCryptoOrderMutation.isPending}
                      className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                      {createCryptoOrderMutation.isPending ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <Wallet className="w-5 h-5" />
                      )}
                      Create Crypto Payment
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}

            {showPaymentForm && selectedPaymentMethod === 'crypto' && cryptoPaymentData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <CryptoPayment
                  paymentData={cryptoPaymentData}
                  onPaymentComplete={handlePaymentSuccess}
                  onPaymentFailed={handlePaymentError}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Order Summary Modal */}
      {shippingPreview && shippingAddress && cartData && (
        <OrderSummaryModal
          isOpen={showOrderSummaryModal}
          onClose={handleOrderSummaryBack}
          onContinue={handleOrderSummaryContinue}
          shippingPreview={shippingPreview}
          shippingAddress={shippingAddress}
          cartItems={cartData.items}
          totals={totals}
          isLoading={createStripeOrderMutation.isPending || createCryptoOrderMutation.isPending}
        />
      )}
    </RFlex>
  );
};

export default Checkout;
