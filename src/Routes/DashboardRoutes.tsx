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
];
