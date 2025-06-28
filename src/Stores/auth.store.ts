// store/auth.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { telegramService } from "@/Services/telegram.service";
import type { TelegramUser } from "@/Types/telegram";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: TelegramUser | null;
  isTelegramApp: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  initTelegramAuth: () => void;
}

const initState: AuthState = {
  token: null,
  refreshToken: null,
  user: null,
  isTelegramApp: false,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  initTelegramAuth: () => {},
};

export const useAuthStore = create<AuthState>()(
  persist(
    devtools(
      (set, get) => ({
        ...initState,
        
        initTelegramAuth: () => {
          const isTelegramApp = telegramService.init();
          if (isTelegramApp) {
            const user = telegramService.getUser();
            const initData = telegramService.getInitData();
            if (user && initData) {
              set({
                user,
                isTelegramApp: true,
                isAuthenticated: true,
                token: initData, // Use initData as token for Telegram auth
              });
              telegramService.setupTheme();
            }
          }
        },

        login: () => {
          get().initTelegramAuth();
        },

        logout: () => {
          set({
            token: null,
            refreshToken: null,
            user: null,
            isAuthenticated: false,
          });
          if (get().isTelegramApp) {
            telegramService.close();
          }
        },
      }),
      { name: "auth-devtools" }
    ),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isTelegramApp: state.isTelegramApp,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
