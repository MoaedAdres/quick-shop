import { motion } from "framer-motion";
import { icons } from "@/Constants/icons";
import { useWalletStore } from "@/Stores/wallet.store";
import RFlex from "@/RComponents/RFlex";

const Wallet = () => {
  const { wallet, getRecentTransactions, addTransaction } = useWalletStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleAddMoney = () => {
    // Mock adding money
    addTransaction({
      walletId: wallet?.id || "default-wallet",
      type: "credit",
      amount: 50,
      description: "Added funds",
      status: "completed",
    });
  };

  const recentTransactions = getRecentTransactions(10);

  return (
    <RFlex className="flex-col h-full pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <h1 className="text-xl font-semibold text-foreground">Wallet</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Current Balance</h2>
              <i className={`${icons.wallet} text-2xl`} />
            </div>
            <div className="text-3xl font-bold mb-4">
              {formatPrice(wallet?.balance || 0)}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddMoney}
              className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <i className={`${icons.add} text-sm`} />
              Add Money
            </motion.button>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-card border border-border rounded-lg p-4 flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                <i className={`${icons.creditCard} text-blue-500 text-xl`} />
              </div>
              <span className="text-sm font-medium text-foreground">Add Card</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-card border border-border rounded-lg p-4 flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <i className={`${icons.gift} text-green-500 text-xl`} />
              </div>
              <span className="text-sm font-medium text-foreground">Gift Cards</span>
            </motion.button>
          </motion.div>

          {/* Transaction History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-lg border border-border overflow-hidden"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Recent Transactions</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-primary text-sm font-medium"
              >
                View All
              </motion.button>
            </div>
            
            <div className="divide-y divide-border">
              {recentTransactions.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className={`${icons.clock} text-2xl text-muted-foreground`} />
                  </div>
                  <h4 className="font-medium text-foreground mb-2">No transactions yet</h4>
                  <p className="text-sm text-muted-foreground">
                    Your transaction history will appear here
                  </p>
                </div>
              ) : (
                recentTransactions.map((transaction) => (
                  <motion.div
                    key={transaction.id}
                    whileHover={{ backgroundColor: "var(--muted)" }}
                    className="p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'credit' 
                          ? 'bg-green-500/10' 
                          : 'bg-red-500/10'
                      }`}>
                        <i className={`${
                          transaction.type === 'credit' 
                            ? icons.add 
                            : icons.remove
                        } text-lg ${
                          transaction.type === 'credit' 
                            ? 'text-green-500' 
                            : 'text-red-500'
                        }`} />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {transaction.description}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(transaction.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${
                        transaction.type === 'credit' 
                          ? 'text-green-500' 
                          : 'text-red-500'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}
                        {formatPrice(transaction.amount)}
                      </div>
                      <div className={`text-xs capitalize ${
                        transaction.status === 'completed' 
                          ? 'text-green-500' 
                          : transaction.status === 'pending'
                          ? 'text-yellow-500'
                          : 'text-red-500'
                      }`}>
                        {transaction.status}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Wallet Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-lg border border-border overflow-hidden"
          >
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Wallet Features</h3>
            </div>
            
            <div className="divide-y divide-border">
              <motion.button
                whileHover={{ backgroundColor: "var(--muted)" }}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <i className={`${icons.settings} text-lg text-muted-foreground`} />
                  <span className="text-foreground">Security Settings</span>
                </div>
                <i className={`${icons.chevronRight} text-muted-foreground`} />
              </motion.button>

              <motion.button
                whileHover={{ backgroundColor: "var(--muted)" }}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <i className={`${icons.clock} text-lg text-muted-foreground`} />
                  <span className="text-foreground">Transaction Limits</span>
                </div>
                <i className={`${icons.chevronRight} text-muted-foreground`} />
              </motion.button>

              <motion.button
                whileHover={{ backgroundColor: "var(--muted)" }}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <i className={`${icons.info} text-lg text-muted-foreground`} />
                  <span className="text-foreground">Help & Support</span>
                </div>
                <i className={`${icons.chevronRight} text-muted-foreground`} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </RFlex>
  );
};

export default Wallet; 