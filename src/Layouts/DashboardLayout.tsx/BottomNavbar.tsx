import { icons } from "@/Constants/icons";
import { useGetCart } from "@/Api/queriesAndMutations";
import RFlex from "@/RComponents/RFlex";
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
          isActive ? "text-primary" : "text-muted-foreground/50"
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
  const { data: cartData } = useGetCart();
  const cartItemCount = cartData?.data?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <RFlex
      id="bottom navbar"
      className="justify-between items-center w-full fixed bottom-0 bg-sidebar border-t border-border z-50 lg:hidden"
    >
      <CustomNavItem title="home" to="home" icon={icons.home} />
      <CustomNavItem 
        title="cart" 
        to="cart" 
        icon={icons.cart} 
        badge={cartItemCount}
      />
      <CustomNavItem title="wallet" to="wallet" icon={icons.wallet} />
      <CustomNavItem title="profile" to="profile" icon={icons.user} />
    </RFlex>
  );
};

export default BottomNavbar;
