import { motion } from "framer-motion";
import { icons } from "@/Constants/icons";
import { mockUser } from "@/data/mock-data";
import RFlex from "@/RComponents/RFlex";
import { useAuthStore } from "@/Stores/auth.store";

const TopBar = () => {
  const { user } = useAuthStore();
  const displayName = user
    ? `${user.first_name} ${user.last_name || ""}`.trim()
    : mockUser.name;
  const avatar = user?.photo_url || mockUser.avatar;
  return (
    <RFlex className="p-4 w-full justify-between items-center bg-card border-b border-border">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <i className={`${icons.cart} text-white text-sm`} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">Quick Shop</h1>
          <p className="text-xs text-muted-foreground">Your favorite store</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary"
        >
          <img
            src={avatar}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </motion.div>
    </RFlex>
  );
};

export default TopBar;
