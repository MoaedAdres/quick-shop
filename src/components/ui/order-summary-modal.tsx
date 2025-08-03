import { motion, AnimatePresence } from "framer-motion";
import { icons } from "@/Constants/icons";
import { formatTaxRate } from "@/Constants/tax";
import type {
  ShippingPreviewSuccess,
  ShippingAddress,
  CartItem,
} from "@/Types/types";

interface OrderSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  shippingPreview: ShippingPreviewSuccess;
  shippingAddress: ShippingAddress;
  cartItems: CartItem[];
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  isLoading?: boolean;
}

const OrderSummaryModal = ({
  isOpen,
  onClose,
  onContinue,
  shippingPreview,
  shippingAddress,
  cartItems,
  totals,
  isLoading = false,
}: OrderSummaryModalProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatAddress = (address: ShippingAddress) => {
    const parts = [
      address.address,
      address.address2,
      address.city,
      address.province,
      address.country,
      address.zip,
    ].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto border border-border"
          >
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  Order Summary
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                >
                  <i className={`${icons.close} text-muted-foreground`} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Shipping Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">
                  Shipping Information
                </h3>
                <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                                     <div className="flex items-start gap-2">
                     <i className={`${icons.user} text-muted-foreground mt-1`} />
                     <div>
                       <p className="font-medium text-foreground">
                         {shippingAddress.full_name}
                       </p>
                       <p className="text-sm text-muted-foreground">
                         {shippingAddress.contact_person}
                       </p>
                     </div>
                   </div>
                   <div className="flex items-start gap-2">
                     <i className={`${icons.phone} text-muted-foreground mt-1`} />
                     <p className="text-sm text-muted-foreground">
                       {shippingAddress.phone_country} {shippingAddress.mobile_no}
                     </p>
                   </div>
                   <div className="flex items-start gap-2">
                     <i className={`${icons.location} text-muted-foreground mt-1`} />
                     <p className="text-sm text-muted-foreground">
                       {formatAddress(shippingAddress)}
                     </p>
                   </div>
                </div>
              </div>

              {/* Shipping Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">
                  Shipping Details
                </h3>
                <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Shipping Fee
                    </span>
                    <span className="font-medium text-foreground">
                      {formatPrice(shippingPreview.data.total_shipping_fee)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Delivery Time
                    </span>
                    <span className="font-medium text-foreground">
                      {shippingPreview.data.estimated_delivery_min_days} -{" "}
                      {shippingPreview.data.estimated_delivery_max_days} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Shipping Company
                    </span>
                    <span className="font-medium text-foreground">
                      {shippingPreview.data.shipping_companies[0]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">
                  Order Items ({cartItems.length})
                </h3>
                <div className="space-y-3 max-h-32 overflow-y-auto">
                  {cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                    >
                                             <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                         <i className={`${icons.shoppingBag} text-muted-foreground`} />
                       </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">
                          {formatPrice(parseFloat(item.product.price) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Totals */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-foreground">
                  Order Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Subtotal
                    </span>
                    <span className="text-foreground">
                      {formatPrice(totals.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Shipping
                    </span>
                    <span className="text-foreground">
                      {formatPrice(totals.shipping)}
                    </span>
                  </div>
                                     <div className="flex justify-between items-center">
                     <span className="text-sm text-muted-foreground">
                       Tax ({formatTaxRate(shippingAddress.country)})
                     </span>
                     <span className="text-foreground">
                       {formatPrice(totals.tax)}
                     </span>
                   </div>
                  <div className="border-t border-border pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-foreground">
                        Total
                      </span>
                      <span className="text-lg font-semibold text-foreground">
                        {formatPrice(totals.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onContinue}
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <i className={`${icons.spinner} animate-spin`} />
                    Initializing Payment...
                  </>
                ) : (
                  <>
                    <i className={icons.creditCard} />
                    Proceed to Payment
                  </>
                )}
              </motion.button>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to Shipping
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderSummaryModal; 