import { useGetOrderDetails } from "@/Api/queriesAndMutations";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading } = useGetOrderDetails(Number(orderId));

  if (isLoading) {
    return <div className="flex items-center justify-center h-[80vh]">Loading...</div>;
  }

  if (!order) {
    return <div className="text-center py-8">Order not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => navigate("/dashboard/orders")}
      >
        ← Back to Orders
      </Button>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        {/* Order Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">Order #{order.id}</h1>
            <p className="text-gray-500">
              Placed on {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <span
              className={cn(
                "px-3 py-1 rounded-full text-sm inline-block",
                {
                  "bg-yellow-100 text-yellow-800": order.status === "pending",
                  "bg-blue-100 text-blue-800": order.status === "processing",
                  "bg-green-100 text-green-800": order.status === "paid",
                  "bg-purple-100 text-purple-800": order.status === "shipped",
                  "bg-emerald-100 text-emerald-800": order.status === "delivered",
                  "bg-red-100 text-red-800": order.status === "cancelled",
                }
              )}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            {order.failure_reason && (
              <p className="text-red-600 text-sm mt-2">{order.failure_reason}</p>
            )}
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Shipping Information */}
          <div>
            <h2 className="font-semibold text-lg mb-4">Shipping Information</h2>
            <div className="space-y-2">
              <p><span className="text-gray-500">Name:</span> {order.full_name}</p>
              <p><span className="text-gray-500">Address:</span> {order.address}</p>
              {order.address2 && (
                <p><span className="text-gray-500">Address 2:</span> {order.address2}</p>
              )}
              <p><span className="text-gray-500">City:</span> {order.city}</p>
              <p><span className="text-gray-500">Province:</span> {order.province}</p>
              <p><span className="text-gray-500">Country:</span> {order.country}</p>
              <p><span className="text-gray-500">ZIP:</span> {order.zip}</p>
              <p><span className="text-gray-500">Phone:</span> {order.mobile_no}</p>
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h2 className="font-semibold text-lg mb-4">Payment Information</h2>
            <div className="space-y-2">
              <p>
                <span className="text-gray-500">Payment Method:</span>{" "}
                {order.payment_method.toUpperCase()}
              </p>
              <p>
                <span className="text-gray-500">Payment Reference:</span>{" "}
                {order.payment_reference}
              </p>
              <p>
                <span className="text-gray-500">Payment Status:</span>{" "}
                {order.paid_at ? "Paid" : "Pending"}
              </p>
              {order.paid_at && (
                <p>
                  <span className="text-gray-500">Paid At:</span>{" "}
                  {new Date(order.paid_at).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-8">
          <h2 className="font-semibold text-lg mb-4">Order Items</h2>
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Product</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Quantity</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Price</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-500">
                            Supplier: {item.product.supplier.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">
                        ${Number(item.product.price).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        ${(Number(item.product.price) * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-8 border-t pt-6">
          <div className="w-full max-w-sm ml-auto space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>${order.items_price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span>${order.shipping_fee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <span>Total</span>
              <span>${order.total_price.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Estimate */}
        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <h2 className="font-semibold mb-2">Estimated Delivery</h2>
          <p>
            {order.estimated_delivery_min_days} - {order.estimated_delivery_max_days} days
          </p>
        </div>
      </div>
    </div>
  );
} 