import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  ShoppingBag, 
  Gift, 
  Coins,
  Save,
  RefreshCw
} from 'lucide-react';
import {
  useGetRecentOrders,
  useGetRecentUsers,
  useGetReferralSettings,
  useUpdateReferralSettings,
  useGetTappingSettings,
  useUpdateTappingSettings,
} from '@/Api/queriesAndMutations';
import { toast } from 'sonner';
import RFlex from '@/RComponents/RFlex';

const AdminDashboard = () => {
  // API hooks
  const { data: recentOrders, isLoading: ordersLoading, refetch: refetchOrders } = useGetRecentOrders();
  const { data: recentUsers, isLoading: usersLoading, refetch: refetchUsers } = useGetRecentUsers();
  const { data: referralSettings, isLoading: referralLoading } = useGetReferralSettings();
  const { data: tappingSettings, isLoading: tappingLoading } = useGetTappingSettings();
  
  const updateReferralMutation = useUpdateReferralSettings();
  const updateTappingMutation = useUpdateTappingSettings();

  // Form states
  const [referralForm, setReferralForm] = useState({
    reward_amount: 0,
  });

  const [tappingForm, setTappingForm] = useState({
    points_per_tap: 1,
    taps_for_reward: 5,
    reward_amount: 10,
    daily_tap_limit: 100,
  });

  // Update form states when data loads
  React.useEffect(() => {
    if (referralSettings?.data) {
      setReferralForm({
        reward_amount: parseFloat(referralSettings.data.reward_amount),
      });
    }
  }, [referralSettings]);

  React.useEffect(() => {
    if (tappingSettings?.data) {
      setTappingForm({
        points_per_tap: tappingSettings.data.points_per_tap,
        taps_for_reward: tappingSettings.data.taps_for_reward,
        reward_amount: tappingSettings.data.reward_amount,
        daily_tap_limit: tappingSettings.data.daily_tap_limit,
      });
    }
  }, [tappingSettings]);

  const handleReferralUpdate = async () => {
    try {
      await updateReferralMutation.mutateAsync(referralForm);
      toast.success('Referral settings updated successfully!');
    } catch (error) {
      console.error('Failed to update referral settings:', error);
    }
  };

  const handleTappingUpdate = async () => {
    try {
      await updateTappingMutation.mutateAsync(tappingForm);
      toast.success('Tapping settings updated successfully!');
    } catch (error) {
      console.error('Failed to update tapping settings:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <RFlex className="flex-col h-full pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your Quick Shop platform</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              refetchOrders();
              refetchUsers();
            }}
            className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-lg border border-border p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-foreground">
                    {recentUsers?.data?.count || 0}
                  </p>
                </div>
                <div className="bg-blue-100 p-2 rounded-full">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-lg border border-border p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-foreground">
                    {recentOrders?.data?.count || 0}
                  </p>
                </div>
                <div className="bg-green-100 p-2 rounded-full">
                  <ShoppingBag className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-lg border border-border p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Referral Reward</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${referralSettings?.data?.reward_amount || '0.00'}
                  </p>
                </div>
                <div className="bg-purple-100 p-2 rounded-full">
                  <Gift className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-lg border border-border p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Points per Tap</p>
                  <p className="text-2xl font-bold text-foreground">
                    {tappingSettings?.data?.points_per_tap || 0}
                  </p>
                </div>
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Coins className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card rounded-lg border border-border p-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
              </div>
              
              {ordersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOrders?.data?.results?.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">#{order.id}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{order.user.username}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">${order.total_price.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">{order.supplier.name}</p>
                      </div>
                    </div>
                  ))}
                  {(!recentOrders?.data?.results || recentOrders.data.results.length === 0) && (
                    <p className="text-center text-muted-foreground py-8">No recent orders</p>
                  )}
                </div>
              )}
            </motion.div>

            {/* Recent Users */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-card rounded-lg border border-border p-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-foreground">Recent Users</h2>
              </div>
              
              {usersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentUsers?.data?.results?.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{user.username}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.firstname} {user.lastname}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(user.created_at)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">${user.balance}</p>
                        <p className="text-xs text-muted-foreground">{user.referral_code}</p>
                      </div>
                    </div>
                  ))}
                  {(!recentUsers?.data?.results || recentUsers.data.results.length === 0) && (
                    <p className="text-center text-muted-foreground py-8">No recent users</p>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Settings Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Referral Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-card rounded-lg border border-border p-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <Gift className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-foreground">Referral Settings</h2>
              </div>
              
              {referralLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Reward Amount ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={referralForm.reward_amount}
                      onChange={(e) => setReferralForm({
                        ...referralForm,
                        reward_amount: parseFloat(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-background text-foreground"
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReferralUpdate}
                    disabled={updateReferralMutation.isPending}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {updateReferralMutation.isPending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Update Referral Settings
                  </motion.button>
                </div>
              )}
            </motion.div>

            {/* Tapping Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-card rounded-lg border border-border p-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <Coins className="w-5 h-5 text-yellow-600" />
                <h2 className="text-lg font-semibold text-foreground">Tapping Settings</h2>
              </div>
              
              {tappingLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Points per Tap
                      </label>
                      <input
                        type="number"
                        value={tappingForm.points_per_tap}
                        onChange={(e) => setTappingForm({
                          ...tappingForm,
                          points_per_tap: parseInt(e.target.value) || 0
                        })}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-background text-foreground"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Taps for Reward
                      </label>
                      <input
                        type="number"
                        value={tappingForm.taps_for_reward}
                        onChange={(e) => setTappingForm({
                          ...tappingForm,
                          taps_for_reward: parseInt(e.target.value) || 0
                        })}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-background text-foreground"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Reward Amount
                      </label>
                      <input
                        type="number"
                        value={tappingForm.reward_amount}
                        onChange={(e) => setTappingForm({
                          ...tappingForm,
                          reward_amount: parseInt(e.target.value) || 0
                        })}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-background text-foreground"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Daily Tap Limit
                      </label>
                      <input
                        type="number"
                        value={tappingForm.daily_tap_limit}
                        onChange={(e) => setTappingForm({
                          ...tappingForm,
                          daily_tap_limit: parseInt(e.target.value) || 0
                        })}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-background text-foreground"
                      />
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleTappingUpdate}
                    disabled={updateTappingMutation.isPending}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {updateTappingMutation.isPending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Update Tapping Settings
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </RFlex>
  );
};

export default AdminDashboard;
