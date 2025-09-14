import { useGetOrderDetails } from "@/Api/queriesAndMutations";
import { useParams, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import RFlex from "@/RComponents/RFlex";
import { icons } from "@/Constants/icons";
import { motion } from "framer-motion";

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading } = useGetOrderDetails(Number(orderId));
  console.log("order", order);

  if (isLoading) {
    return (
      <RFlex className="flex-col h-full pb-20 ">
        <div className="bg-card border-b border-border p-4">
          <h1 className="text-xl font-semibold text-foreground">
            Order Details
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

  if (!order) {
    return (
      <RFlex className="flex-col h-full pb-20 ">
        <div className="bg-card border-b border-border p-4">
          <h1 className="text-xl font-semibold text-foreground">
            Order Details
          </h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <i className={`${icons.error} text-3xl text-red-500 mb-2`} />
            <p className="text-muted-foreground">Order not found</p>
          </div>
        </div>
      </RFlex>
    );
  }

  return (
    <RFlex className="flex-col h-full pb-20 ">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => navigate("/dashboard/orders")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"
          >
            <i className={`${icons.arrowLeft} text-muted-foreground`} />
          </motion.button>
          <h1 className="text-xl font-semibold text-foreground">
            Order #{order.id}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            {/* Order Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Order #{order.id}
                </h2>
                <p className="text-muted-foreground">
                  Placed on {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={cn("px-3 py-1 rounded-full text-sm inline-block", {
                    "bg-yellow-100 text-yellow-800": order.status === "pending",
                    "bg-blue-100 text-blue-800": order.status === "processing",
                    "bg-green-100 text-green-800": order.status === "paid",
                    "bg-purple-100 text-purple-800": order.status === "shipped",
                    "bg-emerald-100 text-emerald-800":
                      order.status === "delivered",
                    "bg-red-100 text-red-800": order.status === "cancelled",
                  })}
                >
                  {order.status?.charAt(0).toUpperCase() +
                    order.status?.slice(1)}
                </span>
                {order.failure_reason && (
                  <p className="text-red-600 text-sm mt-2">
                    {order.failure_reason}
                  </p>
                )}
              </div>
            </div>

            {/* Order Details Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Shipping Information */}
              <div>
                <h3 className="font-semibold text-lg mb-4 text-foreground">
                  Shipping Information
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="text-muted-foreground">Name:</span>{" "}
                    <span className="text-foreground">{order.full_name}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Address:</span>{" "}
                    <span className="text-foreground">{order.address}</span>
                  </p>
                  {order.address2 && (
                    <p>
                      <span className="text-muted-foreground">Address 2:</span>{" "}
                      <span className="text-foreground">{order.address2}</span>
                    </p>
                  )}
                  <p>
                    <span className="text-muted-foreground">City:</span>{" "}
                    <span className="text-foreground">{order.city}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Province:</span>{" "}
                    <span className="text-foreground">{order.province}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Country:</span>{" "}
                    <span className="text-foreground">{order.country}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">ZIP:</span>{" "}
                    <span className="text-foreground">{order.zip}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Phone:</span>{" "}
                    <span className="text-foreground">{order.mobile_no}</span>
                  </p>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="font-semibold text-lg mb-4 text-foreground">
                  Payment Information
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="text-muted-foreground">
                      Payment Method:
                    </span>{" "}
                    <span className="text-foreground">
                      {order.payment_method?.toUpperCase()}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">
                      Payment Status:
                    </span>{" "}
                    <span className="text-foreground">
                      {order.paid_at ? "Paid" : "Pending"}
                    </span>
                  </p>
                  {order.paid_at && (
                    <p>
                      <span className="text-muted-foreground">Paid At:</span>{" "}
                      <span className="text-foreground">
                        {new Date(order.paid_at).toLocaleString()}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-4 text-foreground">
                Order Items
              </h3>

              {/* Desktop Table View */}
              <div className="hidden md:block border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          Product
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          Supplier
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                          Price
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {order.items?.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">
                            <div className="max-w-xs">
                              <p className="font-medium text-foreground text-sm leading-tight line-clamp-2">
                                {item.product.name}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <i
                                className={`${icons.store} text-sm text-muted-foreground`}
                              />
                              <span className="text-sm text-muted-foreground">
                                {item.product.supplier.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center text-foreground">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-right text-foreground">
                            ${Number(item.product.price)?.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right text-foreground">
                            $
                            {(
                              Number(item.product.price) * item.quantity
                            )?.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="bg-card border border-border rounded-lg p-4 space-y-3"
                  >
                    <div>
                      <h4 className="font-medium text-foreground text-sm leading-tight line-clamp-2 mb-2">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        <i
                          className={`${icons.store} text-xs text-muted-foreground`}
                        />
                        <span className="text-xs text-muted-foreground">
                          {item.product.supplier.name}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-muted-foreground">
                          Price: ${Number(item.product.price)?.toFixed(2)}
                        </span>
                      </div>
                      <span className="font-medium text-foreground">
                        $
                        {(Number(item.product.price) * item.quantity)?.toFixed(
                          2
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-4 border-t border-border pt-6">
              <div className="w-full space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">
                    ${order.items_price?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    ${order.shipping_fee?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">
                    ${order.total_price?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Estimate */}
            {order.status !== "Payment_failed" && (
              <div className="mt-8 bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-foreground">
                  Estimated Delivery
                </h3>
                <p className="text-foreground">
                  {order.estimated_delivery_min_days} -{" "}
                  {order.estimated_delivery_max_days} days
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </RFlex>
  );
}
