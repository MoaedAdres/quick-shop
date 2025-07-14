import { useGetOrders } from "@/Api/queriesAndMutations";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="flex items-center justify-center h-[80vh]">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      
      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
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
          <div
            key={order.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/dashboard/orders/${order.id}`)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">Order #{order.id}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs",
                  {
                    "bg-yellow-100 text-yellow-800": order.status === "pending",
                    "bg-blue-100 text-blue-800": order.status === "processing",
                    "bg-green-100 text-green-800": order.status === "paid",
                    "bg-purple-100 text-purple-800": order.status === "shipped",
                    "bg-emerald-100 text-emerald-800": order.status === "delivered",
                    "bg-red-100 text-red-800": order.status === "cancelled",
                  }
                )}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <span className="font-semibold mt-2">${order.total_price.toFixed(2)}</span>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm line-clamp-1">{item.product.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm">${Number(item.product.price).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span>Items ({order.product_total})</span>
                <span>${order.items_price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>${order.shipping_fee.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}

        {orders?.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
} 