import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Elements } from "@stripe/react-stripe-js";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { icons } from "@/Constants/icons";
import { getStripe, STRIPE_CONFIG } from "@/Config/stripe";
import type { ShippingAddress, CartItem } from "@/Types/types";

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
  const [isReady, setIsReady] = useState(false);

  // Wait for Stripe to be ready
  useEffect(() => {
    if (stripe && elements) {
      setIsReady(true);
    }
  }, [stripe, elements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !isReady) {
      onError(
        "Payment system is not ready. Please wait a moment and try again."
      );
      return;
    }

    setIsLoading(true);

    try {
      // Validate the form before submitting
      const { error: submitError } = await elements.submit();
      if (submitError) {
        onError(submitError.message || "Please check your payment details.");
        setIsLoading(false);
        return;
      }

      const { error } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        onError(error.message || "Payment failed. Please try again.");
      } else {
        onSuccess();
      }
    } catch (error) {
      console.error("Payment error:", error);
      onError("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="min-h-[200px]">
        {isReady ? (
          <PaymentElement
            options={{
              layout: "tabs",
            }}
          />
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <i
                className={`${icons.spinner} text-2xl text-primary animate-spin mb-2`}
              />
              <p className="text-muted-foreground text-sm">
                Loading payment form...
              </p>
            </div>
          </div>
        )}
      </div>

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
          disabled={isLoading}
        >
          Cancel
        </motion.button>

        <motion.button
          type="submit"
          disabled={!stripe || !elements || !isReady || isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <i className={`${icons.spinner} animate-spin`} />
              Processing...
            </>
          ) : !isReady ? (
            <>
              <i className={`${icons.spinner} animate-spin`} />
              Loading...
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
  const [stripeInstance, setStripeInstance] = useState<any>(null);

  useEffect(() => {
    // Get the stripe instance once when component mounts
    const loadStripeInstance = async () => {
      try {
        const stripe = await getStripe();
        setStripeInstance(stripe);
      } catch (error) {
        console.error("Failed to load Stripe:", error);
        onError("Failed to load payment system. Please refresh and try again.");
      }
    };

    loadStripeInstance();
  }, []); // Only run once

  if (!stripeInstance) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <i
            className={`${icons.spinner} text-2xl text-primary animate-spin mb-2`}
          />
          <p className="text-muted-foreground text-sm">
            Initializing payment system...
          </p>
        </div>
      </div>
    );
  }

  // Elements options - dynamically get appearance based on current theme
  const elementsOptions = {
    clientSecret,
    appearance: STRIPE_CONFIG.getAppearance(),
    loader: "auto" as const,
  };

  return (
    <Elements
      stripe={stripeInstance}
      options={elementsOptions}
      key={clientSecret} // Key ensures new Elements instance only when clientSecret changes
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
