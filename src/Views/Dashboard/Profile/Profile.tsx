import { useState } from "react";
import { motion } from "framer-motion";
import { icons } from "@/Constants/icons";
import { mockUser } from "@/data/mock-data";
import RFlex from "@/RComponents/RFlex";
import { useAuthStore } from "@/Stores/auth.store";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AddressManagement from "@/components/ui/address-management";
import {
  useGetOrders,
  useSetUserCountry,
  useGetUserProfile,
} from "@/Api/queriesAndMutations";
import CountrySelector from "@/components/ui/country-selector";
import type { AliExpressCountry } from "@/Constants/aliexpressCountries";
import { getCountryByCode } from "@/Constants/aliexpressCountries";
import { toast } from "sonner";

const Profile = () => {
  const { t } = useTranslation();
  const { user, profile, logout } = useAuthStore();
  const navigate = useNavigate();

  // Fetch profile data using the hook
  const { data: profileData } = useGetUserProfile();
  const userCountry = profileData?.data?.country;
  // Update auth store when profile data is fetched
  // useEffect(() => {
  //   if (profileData?.data && !profile) {
  //     updateProfile(profileData.data);
  //   }
  // }, [profileData, profile, updateProfile]);

  // Fetch recent orders (limit to 3 most recent)
  const { data: orders, isLoading: ordersLoading } = useGetOrders();
  const recentOrders = orders?.slice(0, 3) || [];

  // Country selection state
  const [selectedCountry, setSelectedCountry] = useState<string>(
    userCountry ?? ""
  );
  const setUserCountryMutation = useSetUserCountry();

  // Use profile data if available, fallback to Telegram user data
  const displayName = profile
    ? `${profile.firstname} ${profile.lastname || ""}`.trim()
    : user
    ? `${user.first_name} ${user.last_name || ""}`.trim()
    : mockUser.name;
  const avatar = profile?.picture_url || user?.photo_url || mockUser.avatar;
  const email = user?.username ? `@${user.username}` : mockUser.email;

  const handleLogout = () => {
    logout();
  };

  const handleCountryUpdate = async () => {
    if (!selectedCountry) {
      toast.error("Please select a country");
      return;
    }

    try {
      await setUserCountryMutation.mutateAsync({ country: selectedCountry });

      // Update only the country state separately
      toast.success(
        "Country updated successfully! This will improve your browsing experience."
      );
    } catch (error) {
      console.error("Failed to update country:", error);
      toast.error("Failed to update country. Please try again.");
    }
  };

  const handleCountrySelect = (country: AliExpressCountry) => {
    setSelectedCountry(country.code);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-green-500";
      case "shipped":
        return "text-blue-500";
      case "processing":
        return "text-yellow-500";
      case "paid":
        return "text-green-600";
      case "pending":
        return "text-orange-500";
      case "payment_failed":
        return "text-red-500";
      case "cancelled":
        return "text-red-500";
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
      case "payment_failed":
        return icons.close;
      case "paid":
        return icons.check;
      case "pending":
        return icons.clock;
      case "cancelled":
        return icons.close;
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
                  <p className="text-sm text-muted-foreground">
                    {user.language_code}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            {/* <div className="grid grid-cols-3 gap-4">
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
            </div> */}
          </motion.div>

          {/* Country Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-lg p-6 border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <i className={`${icons.location} text-lg text-blue-600`} />
              <h3 className="text-lg font-semibold text-foreground">
                Country Settings
              </h3>
            </div>

            <div className="space-y-4">
              {/* Current Country Display */}
              {userCountry && (
                <div className="bg-muted/50 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2">
                    <i
                      className={`${icons.location} text-sm text-muted-foreground`}
                    />
                    <span className="text-sm text-muted-foreground">
                      Current Country:
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {getCountryByCode(userCountry)?.name || userCountry}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select Your Country
                </label>
                <CountrySelector
                  selectedCountry={selectedCountry}
                  onCountrySelect={handleCountrySelect}
                  placeholder="Choose your country"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Setting your country helps us provide better product
                  recommendations, shipping estimates, and localized content for
                  AliExpress products.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCountryUpdate}
                disabled={setUserCountryMutation.isPending || !selectedCountry}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {setUserCountryMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <i className={`${icons.location} text-lg`} />
                )}
                {setUserCountryMutation.isPending
                  ? "Updating..."
                  : "Update Country Settings"}
              </motion.button>
            </div>
          </motion.div>

          {/* Settings Menu */}
          {/* <motion.div
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
          </motion.div> */}

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

            {ordersLoading ? (
              <div className="p-8 flex items-center justify-center">
                <i
                  className={`${icons.spinner} text-2xl text-primary animate-spin`}
                />
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="divide-y divide-border">
                {recentOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    whileHover={{ backgroundColor: "var(--muted)" }}
                    className="p-4 flex items-center justify-between cursor-pointer"
                    onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <i
                        className={`${getStatusIcon(
                          order.status?.toLocaleLowerCase()
                        )} text-lg ${getStatusColor(
                          order.status?.toLocaleLowerCase()
                        )}`}
                      />
                      <div>
                        <div className="font-medium text-foreground">
                          Order #{order.id}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {order.product_total} items •{" "}
                          {formatDate(order.created_at)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">
                        ${order.total_price.toFixed(2)}
                      </div>
                      <div
                        className={`text-sm capitalize ${getStatusColor(
                          order.status?.toLocaleLowerCase()
                        )}`}
                      >
                        {order.status}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No orders yet</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/dashboard")}
                  className="mt-2 text-primary text-sm font-medium"
                >
                  Start Shopping
                </motion.button>
              </div>
            )}
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
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-card rounded-lg border border-border p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <i
                  className={`${icons.settings} text-lg text-muted-foreground`}
                />
                <div>
                  <span className="text-foreground font-medium">
                    Admin Mode
                  </span>
                  <p className="text-sm text-muted-foreground">
                    Toggle admin access for testing
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAdmin(!isAdmin)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAdmin ? "bg-blue-600" : "bg-gray-300"
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
                  ✅ Admin mode is active. You can access the admin dashboard
                  from the bottom navigation.
                </p>
              </motion.div>
            )}
          </motion.div> */}

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
