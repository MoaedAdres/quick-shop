// store/auth.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { telegramService } from "@/Services/telegram.service";
import { backApis } from "@/Api/endpoints";
import type { TelegramUser } from "@/Types/telegram";
import type { TelegramLoginPayload, TelegramLoginResponse, UserProfileResponse } from "@/Types/types";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: TelegramUser | null;
  profile: UserProfileResponse["data"] | null;
  userCountry: string | null; // Separate country state
  isTelegramApp: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  profileFetched: boolean; // Track if profile has been fetched
  isReferred: boolean;
  login: () => Promise<void>;
  logout: () => void;
  setIsAdmin: (isAdmin: boolean) => void;
  updateProfile: (updatedProfile: UserProfileResponse["data"]) => void;
  setUserCountry: (country: string) => void;
  setIsReferred: (isReferred: boolean) => void;
}

const initState: AuthState = {
  token: null,
  refreshToken: null,
  user: null,
  profile: null,
  userCountry: null,
  isTelegramApp: false,
  isAuthenticated: false,
  isLoading: false,
  isAdmin: false,
  profileFetched: false,
  isReferred: false,
  login: async () => {},
  logout: () => {},
  setIsAdmin: () => {},
  updateProfile: () => {},
  setUserCountry: () => {},
  setIsReferred: () => {},
};

export const useAuthStore = create<AuthState>()(
  persist(
    devtools(
      (set, get) => ({
        ...initState,

        login: async () => {
          set({ isLoading: true });
          
          try {
            // Initialize Telegram service
            const isTelegramApp = telegramService.init();
            
            if (!isTelegramApp) {
              console.error('Not running in Telegram Web App');
              set({ isLoading: false });
              return;
            }

            const user = telegramService.getUser();
            const initData = telegramService.getInitData();
            
            if (!user || !initData) {
              console.error('No user data or init data available');
              set({ isLoading: false });
              return;
            }

            // Extract referral code from start parameter if available
            const webApp = telegramService.getWebApp();
            const referralCode = webApp?.initDataUnsafe?.start_param;

            // Create login payload
            const loginPayload: TelegramLoginPayload = {
              telegram_id: user.id.toString(),
              first_name: user.first_name,
              last_name: user.last_name || '',
              username: user.username || '',
              photo_url: user.photo_url || '',
              auth_date: webApp?.initDataUnsafe?.auth_date?.toString() || '',
              hash: webApp?.initDataUnsafe?.hash || '',
              referral_code: referralCode,
            };

            // Call backend API for authentication
            const response = await backApis.telegramLogin(loginPayload);
            const loginResponse: TelegramLoginResponse = response.data;

            // Store authentication data
            set({
              user,
              isTelegramApp: true,
              isAuthenticated: true,
              token: loginResponse.data.access_token,
              refreshToken: loginResponse.data.refresh_token,
              isReferred: loginResponse.data.user.is_referred,
              isLoading: false,
            });

            // Setup Telegram theme
            telegramService.setupTheme();
            
            console.log('Login successful:', loginResponse);
            
          } catch (error) {
            console.error('Login failed:', error);
            set({ 
              isLoading: false,
              isAuthenticated: false,
              token: null,
              refreshToken: null,
            });
            
            // If API call fails, fall back to basic Telegram auth
            const user = telegramService.getUser();
            const initData = telegramService.getInitData();
            if (user && initData) {
              set({
                user,
                isTelegramApp: true,
                isAuthenticated: true,
                token: initData,
              });
              telegramService.setupTheme();
            }
          }
        },

        logout: () => {
          set({
            token: null,
            refreshToken: null,
            user: null,
            profile: null,
            userCountry: null,
            isAuthenticated: false,
            isLoading: false,
            isAdmin: false,
            profileFetched: false,
            isReferred: false,
          });
          if (get().isTelegramApp) {
            telegramService.close();
          }
        },

        setIsAdmin: (isAdmin: boolean) => {
          set({ isAdmin });
        },

        updateProfile: (updatedProfile: UserProfileResponse["data"]) => {
          set({
            profile: updatedProfile,
            userCountry: updatedProfile.country || null, // Update country separately
            isAdmin: updatedProfile.is_admin || false,
          });
        },

        setUserCountry: (country: string) => {
          set({ userCountry: country });
        },

        setIsReferred: (isReferred: boolean) => {
          set({ isReferred });
        },
      }),
      { name: "auth-devtools" }
    ),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        profile: state.profile,
        userCountry: state.userCountry,
        isTelegramApp: state.isTelegramApp,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
        profileFetched: state.profileFetched,
        isReferred: state.isReferred,
      }),
    }
  )
);
