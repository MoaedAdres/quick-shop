import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
import { icons } from "@/Constants/icons";
import { useCreateCryptoOrder } from "@/Api/queriesAndMutations";
import RFlex from "@/RComponents/RFlex";
import CryptoPayment from "@/components/ui/crypto-payment";
import CryptoCurrencySelector from "@/components/ui/crypto-currency-selector";
import type {
  ShippingPreviewSuccess,
  ShippingAddress,
  SupportedCurrency,
  CryptoPaymentResponse,
} from "@/Types/types";
import { toast } from "sonner";

const CryptoCheckout = () => {
  const navigate = useNavigate();
  const [shippingPreview, setShippingPreview] =
    useState<ShippingPreviewSuccess | null>(null);
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress | null>(null);
  const [selectedCryptoCurrency, setSelectedCryptoCurrency] =
    useState<SupportedCurrency | null>(null);
  const [cryptoPaymentData, setCryptoPaymentData] = useState<
    CryptoPaymentResponse["data"] | null
  >(null);
  const [orderIds, setOrderIds] = useState<string[]>([]);
  const createCryptoOrderMutation = useCreateCryptoOrder();

  useEffect(() => {
    // Load data from localStorage
    const storedPreview = localStorage.getItem("checkout_shipping_preview");
    const storedAddress = localStorage.getItem("checkout_shipping_address");

    if (storedPreview && storedAddress) {
      setShippingPreview(JSON.parse(storedPreview));
      setShippingAddress(JSON.parse(storedAddress));
    } else {
      // If no shipping data, redirect back to shipping
      navigate("/dashboard/checkout/shipping");
    }
  }, [navigate]);

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

  const handlePaymentComplete = () => {
    // Clear checkout data from localStorage
    localStorage.removeItem("checkout_shipping_preview");
    localStorage.removeItem("checkout_shipping_address");
    localStorage.removeItem("checkout_payment_method");

    toast.success(`Payment successful! Your order has been placed.`);
    navigate("/dashboard/orders");
  };

  const handlePaymentFailed = (error: string) => {
    toast.error(error);
  };

  if (!shippingPreview || !shippingAddress) {
    return (
      <RFlex className="flex-col h-full pb-20">
        <div className="bg-card border-b border-border p-4">
          <h1 className="text-xl font-semibold text-foreground">
            Cryptocurrency Payment
          </h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <i
            className={`${icons.spinner} text-2xl text-primary animate-spin`}
          />
        </div>
      </RFlex>
    );
  }

  return (
    <RFlex className="flex-col h-full pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => navigate("/dashboard/checkout/payment")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"
          >
            <i className={`${icons.arrowLeft} text-muted-foreground`} />
          </motion.button>
          <h1 className="text-xl font-semibold text-foreground">
            Cryptocurrency Payment
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {!cryptoPaymentData ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Select Cryptocurrency
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Choose your preferred cryptocurrency
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
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors font-semibold"
                  >
                    {createCryptoOrderMutation.isPending ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <Wallet className="w-5 h-5" />
                    )}
                    {createCryptoOrderMutation.isPending
                      ? "Creating Payment..."
                      : "Create Crypto Payment"}
                  </motion.button>
                )}

                {/* Selected Currency Info */}
                {selectedCryptoCurrency && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-muted/50 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">
                          {selectedCryptoCurrency.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {selectedCryptoCurrency.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {selectedCryptoCurrency.id.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CryptoPayment
                paymentData={cryptoPaymentData}
                onPaymentComplete={handlePaymentComplete}
                onPaymentFailed={handlePaymentFailed}
              />
            </motion.div>
          )}
        </div>
      </div>
    </RFlex>
  );
};

export default CryptoCheckout;
