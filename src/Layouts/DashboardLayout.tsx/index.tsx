import BottomNavbar from "@/Layouts/DashboardLayout.tsx/BottomNavbar";
import RFlex from "@/RComponents/RFlex";
import { createContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";

export interface DashboardContextType {
  theme: string;
  toggleTheme: (newTheme: string) => void;
  activeLanguage: string;
  switchLanguage: (language: string) => void;
}

// Create the ThemeContext with a default value of `undefined` initially
export const DashboardContext = createContext<DashboardContextType>({
  theme: "",
  toggleTheme: () => {},
  activeLanguage: "en",
  switchLanguage: () => {},
});

const DashboardLayout = () => {
  const [activeLanguage, setActiveLanguage] = useState<string>(
    localStorage.getItem("lang") || "en"
  );
  const [theme, setTheme] = useState<string>(
    localStorage.getItem("theme") || "dark"
  ); // Default theme

  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme);
    document.querySelector("html")?.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme); // Persist theme
  };

  const switchLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setActiveLanguage(language);
    document.querySelector("html")?.setAttribute("lang", language);
    localStorage.setItem("lang", language); // Persist theme
  };

  const { i18n } = useTranslation();
  
  useEffect(() => {
    const language = localStorage.getItem("lang");
    if (language) {
      setActiveLanguage(language);
      i18n.changeLanguage(language);
    }
  }, []);

  return (
    <DashboardContext.Provider
      value={{ theme, toggleTheme, activeLanguage, switchLanguage }}
    >
      <RFlex 
        id="dashboard container" 
        className="flex-col h-screen w-full bg-background"
      >
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
        <BottomNavbar />
      </RFlex>
    </DashboardContext.Provider>
  );
};

export default DashboardLayout;
