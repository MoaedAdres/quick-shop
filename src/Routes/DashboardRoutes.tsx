import { type RouteObject } from "react-router-dom";

export const dashboardRoutes: RouteObject[] = [
  {
    id: "home",
    path: "home",
    lazy: async () => {
      const module = await import("@/Views/Dashboard/Home/Home");
      return { element: <module.default /> };
    },
  },
      {
      id: "search",
      path: "search",
      lazy: async () => {
        const module = await import("@/Views/Dashboard/Search/SearchPage");
        return { element: <module.default /> };
      },
    },
    {
      id: "checkout",
      path: "checkout",
      children: [
        {
          id: "checkout-shipping",
          path: "shipping",
          lazy: async () => {
            const module = await import("@/Views/Dashboard/Checkout/Shipping");
            return { element: <module.default /> };
          },
        },
        {
          id: "checkout-payment",
          path: "payment",
          children: [
            {
              id: "checkout-payment-method",
              index: true,
              lazy: async () => {
                const module = await import("@/Views/Dashboard/Checkout/PaymentMethod");
                return { element: <module.default /> };
              },
            },
            {
              id: "checkout-stripe",
              path: "stripe",
              lazy: async () => {
                const module = await import("@/Views/Dashboard/Checkout/StripeCheckout");
                return { element: <module.default /> };
              },
            },
            {
              id: "checkout-crypto",
              path: "crypto",
              lazy: async () => {
                const module = await import("@/Views/Dashboard/Checkout/CryptoCheckout");
                return { element: <module.default /> };
              },
            },
          ],
        },
        {
          id: "checkout-legacy",
          path: "",
          lazy: async () => {
            const module = await import("@/Views/Dashboard/Checkout/Checkout");
            return { element: <module.default /> };
          },
        },
      ],
    },
  {
    id: "cart",
    path: "cart",
    lazy: async () => {
      const module = await import("@/Views/Dashboard/Cart/Cart");
      return { element: <module.default /> };
    },
  },
  {
    id: "profile",
    path: "profile",
    lazy: async () => {
      const module = await import("@/Views/Dashboard/Profile/Profile");
      return { element: <module.default /> };
    },
  },
  {
    id: "wallet",
    path: "wallet",
    lazy: async () => {
      const module = await import("@/Views/Dashboard/Wallet/Wallet");
      return { element: <module.default /> };
    },
  },
  {
    id: "orders",
    path: "orders",
    lazy: async () => {
      const module = await import("@/Views/Dashboard/Orders/Orders");
      return { element: <module.default /> };
    },
  },
  {
    id: "order-details",
    path: "orders/:orderId",
    lazy: async () => {
      const module = await import("@/Views/Dashboard/Orders/OrderDetails");
      return { element: <module.default /> };
    },
  },
  {
    id: "product",
    path: "product/:productId",
    lazy: async () => {
      const module = await import("@/Views/Dashboard/Product/ProductDetails");
      return { element: <module.default /> };
    },
  },
  {
    id: "printify-product",
    path: "printify-product/:productId",
    lazy: async () => {
      const module = await import("@/Views/Dashboard/Product/PrintifyProductDetails");
      return { element: <module.default /> };
    },
  },
  {
    id: "tap-to-earn",
    path: "tap-to-earn",
    lazy: async () => {
      const module = await import("@/Views/Dashboard/TapToEarn/TapToEarn");
      return { element: <module.default /> };
    },
  },
  {
    id: "admin-dashboard",
    path: "admin-dashboard",
    lazy: async () => {
      const module = await import("@/Views/Dashboard/Admin/AdminDashboard");
      return { element: <module.default /> };
    },
  },
] as const;
