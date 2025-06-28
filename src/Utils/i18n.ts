import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Translation resources
import enTranslation from "@/assets/translations/en/en-translation.json";
// import arTranslation from "@/assets/translations/ar/ar-translation.json";
import swTranslation from "@/assets/translations/sw/sw-translation.json";
i18n
  .use(initReactI18next) // Integrate with React
  .init({
    resources: {
      en: { translation: enTranslation },
      // ar: { translation: arTranslation },
      sw: { translation: swTranslation },
    },
    lng: "en", // Default language
    fallbackLng: "en", // Fallback language if key is missing
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
