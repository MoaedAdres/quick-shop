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
];
