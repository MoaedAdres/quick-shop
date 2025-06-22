import { dashboardRoutes } from "@/Routes/DashboardRoutes";
import { protectedRoutes } from "@/Routes/ProtectedRoutes";
import { publicRoutes } from "@/Routes/PublicRoutes";
import ProtectedRoute from "@/Utils/ProtectedRoutes";
import RedirectRoute from "@/Utils/RedirectRoute";
import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";

const App = () => {
  console.log("hellllo")
  useEffect(() => {
    document.querySelector("html")?.setAttribute("data-theme", "dark");
  }, []);
  const router = createBrowserRouter([
    ...publicRoutes,

    {
      element: <ProtectedRoute />,
      children: [
        ...protectedRoutes,
        {
          id: "dashboard",
          path: "/dashboard",
          lazy: async () => {
            const module = await import("@/Layouts/DashboardLayout");
            return { element: <module.default /> };
          },
          children: dashboardRoutes,
          // errorElement:<div>hello</div>
        },
      ],
    },
    {
      path: "*",
      element: <RedirectRoute />,
    },
  ]);
  return (
    <>
      <main className="flex h-screen dark">
        <RouterProvider router={router} />
      </main>
      <Toaster />
    </>
  );
};

export default App;
