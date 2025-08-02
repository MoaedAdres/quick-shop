import { useState } from "react";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { icons } from "@/Constants/icons";
import { useCreateCheckoutSession } from "@/Api/queriesAndMutations";
import type { 
  CreateCheckoutSessionPayload, 
  ShippingAddress, 
  CartItem 
} from "@/Types/types";
import { toast } from "sonner";

interface StripePaymentProps {
  amount: number;
  currency: string;
  shippingAddress: ShippingAddress;
  cartItems: CartItem[];
  onSuccess: () => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

const StripePayment = ({
  amount,
  currency,
  shippingAddress,
  cartItems,
  onSuccess,
  onError,
  onCancel,
}: StripePaymentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const createCheckoutSessionMutation = useCreateCheckoutSession();

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      const payload: CreateCheckoutSessionPayload = {
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        shipping_address: shippingAddress,
        items: cartItems,
        success_url: `${window.location.origin}/dashboard/orders?success=true`,
        cancel_url: `${window.location.origin}/dashboard/cart`,
      };

      const response = await createCheckoutSessionMutation.mutateAsync(payload);
      
      // Redirect to Stripe Checkout
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      const { error } = await stripe!.redirectToCheckout({
        sessionId: response.data.session_id,
      });

      if (error) {
        onError(error.message || "Checkout failed");
      }
    } catch (error) {
      onError("Failed to start checkout. Please try again.");
      console.error("Checkout session creation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
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
          <div className="flex justify-between">
            <span className="text-muted-foreground">Items</span>
            <span className="font-medium">{cartItems.length}</span>
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
          onClick={handleCheckout}
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <i className={`${icons.spinner} text-sm animate-spin mr-2`} />
              Redirecting...
            </div>
          ) : (
            `Pay ${new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: currency.toUpperCase(),
            }).format(amount)}`
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default StripePayment; 