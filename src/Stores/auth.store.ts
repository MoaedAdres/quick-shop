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
  isTelegramApp: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: () => Promise<void>;
  logout: () => void;
  setIsAdmin: (isAdmin: boolean) => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (updatedProfile: UserProfileResponse["data"]) => void;
}

const initState: AuthState = {
  token: null,
  refreshToken: null,
  user: null,
  profile: null,
  isTelegramApp: false,
  isAuthenticated: false,
  isLoading: false,
  isAdmin: false,
  login: async () => {},
  logout: () => {},
  setIsAdmin: () => {},
  fetchProfile: async () => {},
  updateProfile: () => {},
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
            isAuthenticated: false,
            isLoading: false,
            isAdmin: false,
          });
          if (get().isTelegramApp) {
            telegramService.close();
          }
        },

        setIsAdmin: (isAdmin: boolean) => {
          set({ isAdmin });
        },

        fetchProfile: async () => {
          try {
            const response = await backApis.getUserProfile();
            const profileData = response.data;
            
            set({
              profile: profileData.data,
              isAdmin: profileData.data.is_admin || false,
            });
            
            console.log('Profile fetched successfully:', profileData);
          } catch (error) {
            console.error('Failed to fetch profile:', error);
            // Don't set isAdmin to false on error, keep existing state
          }
        },

        updateProfile: (updatedProfile: UserProfileResponse["data"]) => {
          set({
            profile: updatedProfile,
            isAdmin: updatedProfile.is_admin || false,
          });
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
        isTelegramApp: state.isTelegramApp,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    }
  )
);
