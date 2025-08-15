import { useGetOrders } from "@/Api/queriesAndMutations";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import RFlex from "@/RComponents/RFlex";
import { icons } from "@/Constants/icons";
import { motion } from "framer-motion";

const ORDER_STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Paid", value: "paid" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export default function Orders() {
  const [selectedStatus, setSelectedStatus] = useState("");
  const { data: orders, isLoading } = useGetOrders(selectedStatus || undefined);
  console.log("orders", orders);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <RFlex className="flex-col h-full pb-20 ">
        <div className="bg-card border-b border-border p-4">
          <h1 className="text-xl font-semibold text-foreground">My Orders</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <i className={`${icons.spinner} text-2xl text-primary animate-spin`} />
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
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"
          >
            <i className={`${icons.arrowLeft} text-muted-foreground`} />
          </motion.button>
          <h1 className="text-xl font-semibold text-foreground">My Orders</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto pb-4">
            {ORDER_STATUS_OPTIONS.map((status) => (
              <Button
                key={status.value}
                variant={selectedStatus === status.value ? "default" : "outline"}
                onClick={() => setSelectedStatus(status.value)}
                className="whitespace-nowrap"
              >
                {status.label}
              </Button>
            ))}
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {orders?.map((order) => (
              <motion.div
                key={order.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/dashboard/orders/${order.id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">Order #{order.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span
                      className={cn("px-2 py-1 rounded-full text-xs", {
                        "bg-yellow-100 text-yellow-800": order.status === "pending",
                        "bg-blue-100 text-blue-800": order.status === "processing",
                        "bg-green-100 text-green-800": order.status === "paid",
                        "bg-purple-100 text-purple-800": order.status === "shipped",
                        "bg-emerald-100 text-emerald-800":
                          order.status === "delivered",
                        "bg-red-100 text-red-800": order.status === "cancelled",
                      })}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="font-semibold mt-2 text-foreground">
                      ${order.total_price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="flex-1">
                        <p className="text-sm line-clamp-1 text-foreground">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm text-foreground">
                        ${Number(item.product.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items ({order.product_total})</span>
                    <span className="text-foreground">${order.items_price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">${order.shipping_fee.toFixed(2)}</span>
                  </div>
                </div>
              </motion.div>
            ))}

            {orders?.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No orders found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </RFlex>
  );
}
