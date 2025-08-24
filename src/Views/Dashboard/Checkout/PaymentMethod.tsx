import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CreditCard, Wallet } from "lucide-react";
import { icons } from "@/Constants/icons";
import RFlex from "@/RComponents/RFlex";
import type { ShippingAddress } from "@/Types/types";

const PaymentMethod = () => {
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);

  useEffect(() => {
    // Check if we have shipping data
    const storedAddress = localStorage.getItem('checkout_shipping_address');
    
    if (storedAddress) {
      setShippingAddress(JSON.parse(storedAddress));
    } else {
      // If no shipping data, redirect back to shipping
      navigate("/dashboard/checkout/shipping");
    }
  }, [navigate]);

  const handlePaymentMethodSelect = (method: 'stripe' | 'crypto') => {
    // Store selected payment method
    localStorage.setItem('checkout_payment_method', method);
    
    if (method === 'stripe') {
      navigate("/dashboard/checkout/payment/stripe");
    } else {
      navigate("/dashboard/checkout/payment/crypto");
    }
  };

  if (!shippingAddress) {
    return (
      <RFlex className="flex-col h-full pb-20">
        <div className="bg-card border-b border-border p-4">
          <h1 className="text-xl font-semibold text-foreground">Payment Method</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <i className={`${icons.spinner} text-2xl text-primary animate-spin`} />
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
            onClick={() => navigate("/dashboard/checkout/shipping")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"
          >
            <i className={`${icons.arrowLeft} text-muted-foreground`} />
          </motion.button>
          <h1 className="text-xl font-semibold text-foreground">Payment Method</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Choose your payment method
            </h2>
            
            <div className="space-y-4">
              {/* Stripe Payment Option */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePaymentMethodSelect('stripe')}
                className="w-full flex items-center gap-4 p-6 border border-border rounded-lg hover:border-primary/50 hover:bg-muted/50 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-foreground text-lg">Credit/Debit Card</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Pay securely with Visa, Mastercard, American Express
                  </div>
                </div>
                <i className={`${icons.arrowRight} text-muted-foreground`} />
              </motion.button>

              {/* Crypto Payment Option */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePaymentMethodSelect('crypto')}
                className="w-full flex items-center gap-4 p-6 border border-border rounded-lg hover:border-primary/50 hover:bg-muted/50 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-foreground text-lg">Cryptocurrency</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Pay with Bitcoin, USDT, Ethereum, and more
                  </div>
                </div>
                <i className={`${icons.arrowRight} text-muted-foreground`} />
              </motion.button>
            </div>

            {/* Security Notice */}
                         <div className="mt-6 p-4 bg-muted/50 rounded-lg">
               <div className="flex items-start gap-3">
                 <i className={`${icons.check} text-primary text-lg mt-0.5`} />
                 <div>
                   <h3 className="font-medium text-foreground text-sm">Secure Payment</h3>
                   <p className="text-xs text-muted-foreground mt-1">
                     Your payment information is encrypted and secure. We never store your card details.
                   </p>
                 </div>
               </div>
             </div>
          </motion.div>
        </div>
      </div>
    </RFlex>
  );
};

export default PaymentMethod;
