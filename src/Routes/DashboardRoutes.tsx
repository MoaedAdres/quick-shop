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
      lazy: async () => {
        const module = await import("@/Views/Dashboard/Checkout/Checkout");
        return { element: <module.default /> };
      },
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
] as const;
