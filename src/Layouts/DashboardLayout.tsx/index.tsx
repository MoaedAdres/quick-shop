import BottomNavbar from "@/Layouts/DashboardLayout.tsx/BottomNavbar";
import RFlex from "@/RComponents/RFlex";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <RFlex id="dashboard container" className="flex-col h-screen w-full">
      <Outlet />
      <BottomNavbar />
    </RFlex>
  );
};

export default DashboardLayout;
