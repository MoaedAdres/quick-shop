import { icons } from "@/Constants/icons";
import RFlex from "@/RComponents/RFlex";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
const CustomNavItem = ({
  title,
  to,
  icon,
}: {
  title: string;
  to: string;
  icon: string;
}) => {
  const { t } = useTranslation();

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center flex-1 gap-0 p-2 ${
          isActive ? "text-primary" : "text-muted-foreground/50"
        }`
      }
    >
      <i className={`${icon}`} />
      <span>{t(title)}</span>
    </NavLink>
  );
};
const BottomNavbar = () => {
  return (
    <RFlex
      id="bottom navbar"
      className="justify-between items-center w-full fixed bottom-0 bg-sidebar rounded-xl"
    >
      <CustomNavItem title="home" to="home" icon={icons.home} />
      <CustomNavItem title="cart" to="cart" icon={icons.cart} />
      <CustomNavItem title="profile" to="profile" icon={icons.user} />
    </RFlex>
  );
};

export default BottomNavbar;
