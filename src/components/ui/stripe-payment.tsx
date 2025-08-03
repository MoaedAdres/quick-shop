import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { 
  PaymentElement, 
  useStripe, 
  useElements,
} from "@stripe/react-stripe-js";
import { icons } from "@/Constants/icons";
import type { 
  ShippingAddress, 
  CartItem 
} from "@/Types/types";

interface StripePaymentProps {
  clientSecret: string;
  amount: number;
  currency: string;
  shippingAddress: ShippingAddress;
  cartItems: CartItem[];
  onSuccess: () => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

// Payment Form Component
const PaymentForm = ({
  amount,
  currency,
  onSuccess,
  onError,
  onCancel,
}: {
  amount: number;
  currency: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  onCancel: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/orders?success=true`,
        },
      });

      if (error) {
        onError(error.message || "Payment failed");
      } else {
        onSuccess();
      }
    } catch (error) {
      onError("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      <div className="">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Payment Summary
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Amount</span>
            <span className="font-medium">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency.toUpperCase(),
              }).format(amount)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <motion.button
          type="button"
          onClick={onCancel}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 bg-muted text-muted-foreground py-3 px-4 rounded-lg font-medium"
        >
          Cancel
        </motion.button>
        
        <motion.button
          type="submit"
          disabled={!stripe || isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <i className={`${icons.spinner} animate-spin`} />
              Processing...
            </>
          ) : (
            <>
              <i className={icons.creditCard} />
              Pay Now
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
};

// Main Stripe Payment Component
const StripePayment = ({
  clientSecret,
  amount,
  currency,
  onSuccess,
  onError,
  onCancel,
}: StripePaymentProps) => {
  const [stripePromise, setStripePromise] = useState<any>(null);

  useEffect(() => {
    const initStripe = async () => {
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      setStripePromise(stripe);
    };
    initStripe();
  }, []);

  if (!stripePromise) {
    return (
      <div className="flex items-center justify-center py-8">
        <i className={`${icons.spinner} text-2xl text-primary animate-spin`} />
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
        },
      }}
    >
      <PaymentForm
        amount={amount}
        currency={currency}
        onSuccess={onSuccess}
        onError={onError}
        onCancel={onCancel}
      />
    </Elements>
  );
};

export default StripePayment; 