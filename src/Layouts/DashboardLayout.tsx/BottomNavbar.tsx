import { useGetCart } from "@/Api/queriesAndMutations";
import { icons } from "@/Constants/icons";
import RFlex from "@/RComponents/RFlex";
import { useAuthStore } from "@/Stores/auth.store";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

const CustomNavItem = ({
  title,
  to,
  icon,
  badge,
}: {
  title: string;
  to: string;
  icon: string;
  badge?: number;
}) => {
  const { t } = useTranslation();

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center flex-1 gap-1 p-2 relative ${
          isActive ? "text-[#5019F8]" : "text-muted-foreground/50"
        }`
      }
    >
      <div className="relative">
        <i className={`${icon} text-lg`} />
        {badge && badge > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {badge > 99 ? "99+" : badge}
          </div>
        )}
      </div>
      <span className="text-xs font-medium">{t(title)}</span>
    </NavLink>
  );
};

const BottomNavbar = () => {
  const { isAuthenticated, isAdmin } = useAuthStore();
  const { data: cartData } = useGetCart(isAuthenticated);
  const cartItemCount =
    cartData?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  return (
    <RFlex
      id="bottom navbar"
      className="justify-between items-center w-full fixed bottom-0 bg-sidebar border-t border-border z-50"
    >
      <CustomNavItem title="home" to="home" icon={icons.home} />
      <CustomNavItem title="earn" to="tap-to-earn" icon={icons.coins} />
      <CustomNavItem title="search" to="search" icon={icons.search} />
      <CustomNavItem title="cart" to="cart" icon={icons.cart} badge={cartItemCount} />
      {isAdmin && (
        <CustomNavItem title="dashboard" to="admin-dashboard" icon={icons.dashboard} />
      )}
      <CustomNavItem title="profile" to="profile" icon={icons.user} />
    </RFlex>
  );
};

export default BottomNavbar;
