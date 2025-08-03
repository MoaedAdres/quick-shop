import type { TelegramWebApp, TelegramUser } from '@/Types/telegram';

class TelegramService {
  private webApp: TelegramWebApp | null = null;

  init() {
    try {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        this.webApp = window.Telegram.WebApp;
        this.webApp.ready();
        console.log('Telegram WebApp initialized successfully');
        return true;
      }
      console.log('Telegram WebApp not available');
      return false;
    } catch (error) {
      console.error('Error initializing Telegram WebApp:', error);
      return false;
    }
  }

  getWebApp(): TelegramWebApp | null {
    return this.webApp;
  }

  getUser(): TelegramUser | null {
    try {
      const user = this.webApp?.initDataUnsafe?.user || null;
      console.log('Telegram initDataUnsafe:', this.webApp?.initDataUnsafe);
      return user;
    } catch (error) {
      console.error('Error getting Telegram user:', error);
      return null;
    }
  }

  getInitData(): string {
    try {
      const initData = this.webApp?.initData || '';
      console.log('Telegram init data length:', initData.length);
      return initData;
    } catch (error) {
      console.error('Error getting Telegram init data:', error);
      return '';
    }
  }

  isTelegramApp(): boolean {
    return !!this.webApp;
  }

  setupTheme() {
    if (!this.webApp) return;
    try {
      const isDark = this.webApp.colorScheme === 'dark';
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      
      // Only apply Telegram theme colors if they exist and are not the default blue
      if (this.webApp.themeParams) {
        const { bg_color, text_color, button_color, button_text_color } = this.webApp.themeParams;
        
        // Only override background and text colors, preserve your purple theme
        if (bg_color) document.documentElement.style.setProperty('--background', bg_color);
        if (text_color) document.documentElement.style.setProperty('--foreground', text_color);
        
        // Don't override primary color to preserve your purple theme
        // if (button_color) document.documentElement.style.setProperty('--primary', button_color);
        // if (button_text_color) document.documentElement.style.setProperty('--primary-foreground', button_text_color);
      }
      console.log('Telegram theme setup completed - preserving purple theme');
    } catch (error) {
      console.error('Error setting up Telegram theme:', error);
    }
  }

  showMainButton(text: string, callback: () => void) {
    if (!this.webApp) return;
    try {
      this.webApp.MainButton.setText(text);
      this.webApp.MainButton.onClick(callback);
      this.webApp.MainButton.show();
    } catch (error) {
      console.error('Error showing main button:', error);
    }
  }

  hideMainButton() {
    if (!this.webApp) return;
    try {
      this.webApp.MainButton.hide();
    } catch (error) {
      console.error('Error hiding main button:', error);
    }
  }

  showBackButton(callback: () => void) {
    if (!this.webApp) return;
    try {
      this.webApp.BackButton.onClick(callback);
      this.webApp.BackButton.show();
    } catch (error) {
      console.error('Error showing back button:', error);
    }
  }

  hideBackButton() {
    if (!this.webApp) return;
    try {
      this.webApp.BackButton.hide();
    } catch (error) {
      console.error('Error hiding back button:', error);
    }
  }

  showAlert(message: string, callback?: () => void) {
    if (!this.webApp) return;
    try {
      this.webApp.showAlert(message, callback);
    } catch (error) {
      console.error('Error showing alert:', error);
    }
  }

  showConfirm(message: string, callback?: (confirmed: boolean) => void) {
    if (!this.webApp) return;
    try {
      this.webApp.showConfirm(message, callback);
    } catch (error) {
      console.error('Error showing confirm:', error);
    }
  }

  close() {
    if (!this.webApp) return;
    try {
      this.webApp.close();
    } catch (error) {
      console.error('Error closing WebApp:', error);
    }
  }

  expand() {
    if (!this.webApp) return;
    try {
      this.webApp.expand();
    } catch (error) {
      console.error('Error expanding WebApp:', error);
    }
  }

  hapticFeedback(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light') {
    if (!this.webApp) return;
    try {
      this.webApp.HapticFeedback.impactOccurred(style);
    } catch (error) {
      console.error('Error providing haptic feedback:', error);
    }
  }

  logData() {
    if (!this.webApp) return;
    
    try {
      console.log('=== Telegram WebApp Debug Info ===');
      console.log('initDataUnsafe:', this.webApp.initDataUnsafe);
      console.log('initData length:', this.webApp.initData?.length || 0);
      console.log('version:', this.webApp.version);
      console.log('platform:', this.webApp.platform);
      console.log('colorScheme:', this.webApp.colorScheme);
      console.log('themeParams:', this.webApp.themeParams);
      console.log('isExpanded:', this.webApp.isExpanded);
      console.log('viewportHeight:', this.webApp.viewportHeight);
      console.log('================================');
    } catch (error) {
      console.error('Error logging Telegram data:', error);
    }
  }
}

export const telegramService = new TelegramService(); 