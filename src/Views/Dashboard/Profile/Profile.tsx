import { motion } from "framer-motion";
import { icons } from "@/Constants/icons";
import { mockUser } from "@/data/mock-data";
import RFlex from "@/RComponents/RFlex";
import { useAuthStore } from "@/Stores/auth.store";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AddressManagement from "@/components/ui/address-management";

const Profile = () => {
  const { t } = useTranslation();
  const { user, logout, isAdmin, setIsAdmin } = useAuthStore();
  const navigate = useNavigate();
  // Use Telegram user data if available
  const displayName = user ? `${user.first_name} ${user.last_name || ''}`.trim() : mockUser.name;
  const avatar = user?.photo_url || mockUser.avatar;
  const email = user?.username ? `@${user.username}` : mockUser.email;

  const handleLogout = () => {
    logout();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Mock order history
  const mockOrders = [
    {
      id: "order-1",
      status: "delivered" as const,
      total: 89.99,
      items: 2,
      date: "2024-01-15T10:00:00Z",
    },
    {
      id: "order-2",
      status: "shipped" as const,
      total: 124.99,
      items: 3,
      date: "2024-01-20T10:00:00Z",
    },
    {
      id: "order-3",
      status: "processing" as const,
      total: 59.99,
      items: 1,
      date: "2024-01-25T10:00:00Z",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-green-500";
      case "shipped":
        return "text-blue-500";
      case "processing":
        return "text-yellow-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return icons.check;
      case "shipped":
        return icons.truck;
      case "processing":
        return icons.spinner;
      default:
        return icons.clock;
    }
  };

  return (
    <RFlex className="flex-col h-full pb-20 ">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <h1 className="text-xl font-semibold text-foreground">Profile</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* User Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-lg p-6 border border-border"
          >
            <div className="flex items-center gap-4 mb-6">
              <img
                src={avatar}
                alt={displayName}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {displayName}
                </h2>
                <p className="text-muted-foreground">{email}</p>
                {user?.language_code && (
                  <p className="text-sm text-muted-foreground">{user.language_code}</p>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">12</div>
                <div className="text-xs text-muted-foreground">Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">$1,234</div>
                <div className="text-xs text-muted-foreground">Spent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">4.8</div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </div>
            </div>
          </motion.div>

          {/* Settings Menu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-lg border border-border overflow-hidden"
          >
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Settings</h3>
            </div>
            
            <div className="divide-y divide-border">
              <motion.button
                whileHover={{ backgroundColor: "var(--muted)" }}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <i className={`${icons.profile} text-lg text-muted-foreground`} />
                  <span className="text-foreground">Edit Profile</span>
                </div>
                <i className={`${icons.chevronRight} text-muted-foreground`} />
              </motion.button>

              <motion.button
                whileHover={{ backgroundColor: "var(--muted)" }}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <i className={`${icons.address} text-lg text-muted-foreground`} />
                  <span className="text-foreground">Addresses</span>
                </div>
                <i className={`${icons.chevronRight} text-muted-foreground`} />
              </motion.button>

              <motion.button
                whileHover={{ backgroundColor: "var(--muted)" }}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <i className={`${icons.payment} text-lg text-muted-foreground`} />
                  <span className="text-foreground">Payment Methods</span>
                </div>
                <i className={`${icons.chevronRight} text-muted-foreground`} />
              </motion.button>

              <motion.button
                whileHover={{ backgroundColor: "var(--muted)" }}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <i className={`${icons.settings} text-lg text-muted-foreground`} />
                  <span className="text-foreground">Preferences</span>
                </div>
                <i className={`${icons.chevronRight} text-muted-foreground`} />
              </motion.button>
            </div>
          </motion.div>

          {/* Order History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-lg border border-border overflow-hidden"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Recent Orders</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/dashboard/orders")}
                className="text-primary text-sm font-medium"
              >
                {t("view-all")}
              </motion.button>
            </div>
            
            <div className="divide-y divide-border">
              {mockOrders.map((order) => (
                <motion.div
                  key={order.id}
                  whileHover={{ backgroundColor: "var(--muted)" }}
                  className="p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <i className={`${getStatusIcon(order.status)} text-lg ${getStatusColor(order.status)}`} />
                    <div>
                      <div className="font-medium text-foreground">
                        Order #{order.id.split('-')[1]}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.items} items • {formatDate(order.date)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">
                      ${order.total}
                    </div>
                    <div className={`text-sm capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Address Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-lg border border-border p-6"
          >
            <AddressManagement />
          </motion.div>

          {/* Admin Toggle (For Testing) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-card rounded-lg border border-border p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <i className={`${icons.settings} text-lg text-muted-foreground`} />
                <div>
                  <span className="text-foreground font-medium">Admin Mode</span>
                  <p className="text-sm text-muted-foreground">Toggle admin access for testing</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAdmin(!isAdmin)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAdmin ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <motion.div
                  animate={{
                    x: isAdmin ? 20 : 2,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg"
                />
              </motion.button>
            </div>
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 pt-3 border-t border-border"
              >
                <p className="text-sm text-green-600 font-medium">
                  ✅ Admin mode is active. You can access the admin dashboard from the bottom navigation.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Logout Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            <i className={`${icons.logout} text-lg`} />
            Logout
          </motion.button>
        </div>
      </div>
    </RFlex>
  );
};

export default Profile; 