// store/auth.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: unknown;
  login: (data: unknown) => void;
  logout: () => void;
}
const initState: AuthState = {
  token: null,
  refreshToken: null,
  user: null,
  login: () => {},
  logout: () => {},
};
export const useAuthStore = create<AuthState>()(
  persist(
    devtools(
      (set) => ({
        ...initState,
        login: () => set({}),
        logout: () => set({}),
      }),
      { name: "auth-devtools" } // optional: name shown in DevTools
    ),
    {
      name: "auth-storage", // key in localStorage
      // partialize or merge can go here if you ever expand fields
    }
  )
);
