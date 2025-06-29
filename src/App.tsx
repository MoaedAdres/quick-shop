import { dashboardRoutes } from "@/Routes/DashboardRoutes";
import { protectedRoutes } from "@/Routes/ProtectedRoutes";
import { publicRoutes } from "@/Routes/PublicRoutes";
import ProtectedRoute from "@/Utils/ProtectedRoutes";
import RedirectRoute from "@/Utils/RedirectRoute";
import { useAuthStore } from "@/Stores/auth.store";
import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const { initTelegramAuth, isTelegramApp } = useAuthStore();

  useEffect(() => {
    // Initialize Telegram authentication
    initTelegramAuth();
    // Set dark theme by default
    document.querySelector("html")?.setAttribute("data-theme", "dark");
  }, [initTelegramAuth]);

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
            const module = await import("@/Layouts/DashboardLayout.tsx");
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
    <QueryClientProvider client={queryClient}>
      <main id="first div" className={`flex h-screen ${isTelegramApp ? '' : 'dark'}`}>
        <RouterProvider router={router} />
      </main>
      <Toaster />
    </QueryClientProvider>
  );
};

export default App;
