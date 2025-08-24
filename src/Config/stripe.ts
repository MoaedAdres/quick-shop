// Config/stripe.ts
import { loadStripe } from "@stripe/stripe-js";

const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51RGJ7iBmeVlqSj2fuomKkeyJ07bpeBysu0wOGtgE8fstBRg1vdGcPi3takq1SKZN0x0FyXWOHohl8mbQ033VzoI5004oTuWZqY";

// Create stripe promise once and reuse it
let stripePromiseInstance: Promise<any> | null = null;

export const getStripe = () => {
  if (!stripePromiseInstance) {
    stripePromiseInstance = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromiseInstance;
};

// For backward compatibility
export const stripePromise = getStripe();

// Get current theme from document
const getCurrentTheme = () => {
  if (typeof document !== "undefined") {
    return document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light";
  }
  return "light";
};

// Dynamic appearance based on theme
export const getStripeAppearance = () => {
  const isDark = getCurrentTheme() === "dark";

  return {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#5019F8", // Your primary purple
      colorBackground: isDark ? "#0d0a1d" : "#ffffff", // Card background
      colorText: isDark ? "#ffffff" : "#1a1a1a",
      colorDanger: isDark ? "#ff6b7a" : "#df1b41",
      colorTextSecondary: isDark ? "#b4b4b4" : "#6b7280",
      colorTextPlaceholder: isDark ? "#888888" : "#9ca3af",
      fontFamily: "Inter, system-ui, sans-serif",
      spacingUnit: "4px",
      borderRadius: "10px", // Match your --radius: 0.625rem
      borderWidth: "1px",
      colorIcon: isDark ? "#b4b4b4" : "#6b7280",
      colorIconHover: "#5019F8",
    },
    rules: {
      ".Input": {
        backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "#ffffff",
        border: isDark
          ? "1px solid rgba(255, 255, 255, 0.1)"
          : "1px solid #e5e7eb",
        boxShadow: "none",
        color: isDark ? "#ffffff" : "#1a1a1a",
      },
      ".Input:focus": {
        border: "2px solid #5019F8",
        boxShadow: "0 0 0 2px rgba(80, 25, 248, 0.1)",
        outline: "none",
      },
      ".Input--invalid": {
        border: isDark ? "1px solid #ff6b7a" : "1px solid #df1b41",
      },
      ".Label": {
        color: isDark ? "#ffffff" : "#374151",
        fontWeight: "500",
        fontSize: "14px",
        marginBottom: "6px",
      },
      ".Error": {
        color: isDark ? "#ff6b7a" : "#df1b41",
        fontSize: "13px",
      },
      ".Tab": {
        backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "#f9fafb",
        border: isDark
          ? "1px solid rgba(255, 255, 255, 0.1)"
          : "1px solid #e5e7eb",
        color: isDark ? "#b4b4b4" : "#6b7280",
      },
      ".Tab:hover": {
        backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#f3f4f6",
        color: isDark ? "#ffffff" : "#374151",
      },
      ".Tab--selected": {
        backgroundColor: isDark ? "#5019F8" : "#5019F8",
        border: "1px solid #5019F8",
        color: "#ffffff",
      },
      ".TabIcon": {
        color: "inherit",
      },
    },
  };
};

export const STRIPE_CONFIG = {
  publishableKey: STRIPE_PUBLISHABLE_KEY,
  getAppearance: getStripeAppearance,
};
