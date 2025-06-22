import BottomNavbar from "@/Layouts/DashboardLayout.tsx/BottomNavbar";
import RFlex from "@/RComponents/RFlex";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [activeLanguage, setActiveLanguage] = useState<string>(
    localStorage.getItem("lang") || "en"
  );
  const { i18n } = useTranslation();
  useEffect(() => {
    const language = localStorage.getItem("lang");
    if (language) {
      setActiveLanguage(language);
      i18n.changeLanguage(language);
    }
  }, []);
  return (
    <RFlex id="dashboard container" className="flex-col h-screen w-full">
      <Outlet />
      <BottomNavbar />
    </RFlex>
  );
};

export default DashboardLayout;
