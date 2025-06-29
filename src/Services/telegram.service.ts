import type { TelegramWebApp, TelegramUser } from '@/Types/telegram';

class TelegramService {
  private webApp: TelegramWebApp | null = null;

  init() {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      this.webApp = window.Telegram.WebApp;
      this.webApp.ready();
      return true;
    }
    return false;
  }

  getWebApp(): TelegramWebApp | null {
    return this.webApp;
  }

  getUser(): TelegramUser | null {
    return this.webApp?.initDataUnsafe?.user || null;
  }

  getInitData(): string {
    return this.webApp?.initData || '';
  }

  isTelegramApp(): boolean {
    return !!this.webApp;
  }

  setupTheme() {
    if (!this.webApp) return;
    const isDark = this.webApp.colorScheme === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    if (this.webApp.themeParams) {
      const { bg_color, text_color, button_color, button_text_color } = this.webApp.themeParams;
      if (bg_color) document.documentElement.style.setProperty('--background', bg_color);
      if (text_color) document.documentElement.style.setProperty('--foreground', text_color);
      if (button_color) document.documentElement.style.setProperty('--primary', button_color);
      if (button_text_color) document.documentElement.style.setProperty('--primary-foreground', button_text_color);
    }
  }

  showMainButton(text: string, callback: () => void) {
    if (!this.webApp) return;
    this.webApp.MainButton.setText(text);
    this.webApp.MainButton.onClick(callback);
    this.webApp.MainButton.show();
  }

  hideMainButton() {
    if (!this.webApp) return;
    this.webApp.MainButton.hide();
  }

  showBackButton(callback: () => void) {
    if (!this.webApp) return;
    this.webApp.BackButton.onClick(callback);
    this.webApp.BackButton.show();
  }

  hideBackButton() {
    if (!this.webApp) return;
    this.webApp.BackButton.hide();
  }

  showAlert(message: string, callback?: () => void) {
    if (!this.webApp) return;
    this.webApp.showAlert(message, callback);
  }

  showConfirm(message: string, callback?: (confirmed: boolean) => void) {
    if (!this.webApp) return;
    this.webApp.showConfirm(message, callback);
  }

  close() {
    if (!this.webApp) return;
    this.webApp.close();
  }

  expand() {
    if (!this.webApp) return;
    this.webApp.expand();
  }

  hapticFeedback(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light') {
    if (!this.webApp) return;
    this.webApp.HapticFeedback.impactOccurred(style);
  }
  logData() {
    if (!this.webApp) return;
    
    console.log('telegram log: initDataUnsafe:', this.webApp.initDataUnsafe);
    console.log('telegram log: initData:', this.webApp.initData);
  }
}

export const telegramService = new TelegramService(); 