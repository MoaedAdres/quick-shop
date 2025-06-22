import { icons } from "@/Constants/icons";
import RFlex from "@/RComponents/RFlex";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
const CustomNavItem = ({ title, to }: { title: string; to: string }) => {
  const { t } = useTranslation();

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center flex-1 gap-0 p-2 ${
          isActive ? "text-red-500" : ""
        }`
      }
    >
      <i className={`${icons.home}`} />
      <span>{t(title)}</span>
    </NavLink>
  );
};
const BottomNavbar = () => {
  return (
    <RFlex
      id="bottom navbar"
      className="justify-between items-center w-full fixed bottom-0 bg-sidebar rounded-lg"
    >
      <CustomNavItem title="home" to="home" />
      <CustomNavItem title="cart" to="cart" />
      <CustomNavItem title="profile" to="profile" />
    </RFlex>
  );
};

export default BottomNavbar;
