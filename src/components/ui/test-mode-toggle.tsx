import React from "react";
import { motion } from "framer-motion";
import { TestTube } from "lucide-react";
import { getNowPaymentsConfig } from "@/Config/nowpayments";

interface TestModeToggleProps {
  onToggle: (enabled: boolean) => void;
  className?: string;
}

const TestModeToggle: React.FC<TestModeToggleProps> = ({
  onToggle,
  className = "",
}) => {
  const config = getNowPaymentsConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card rounded-lg border border-border p-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
            <TestTube className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              NOWPayments Test Mode
            </h3>
            <p className="text-sm text-muted-foreground">
              {config.isTestMode
                ? "Currently using testnet currencies for testing"
                : "Switch to testnet for safe payment testing"}
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onToggle(!config.isTestMode)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            config.isTestMode ? "bg-orange-600" : "bg-gray-300"
          }`}
        >
          <motion.div
            animate={{
              x: config.isTestMode ? 20 : 2,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg"
          />
        </motion.button>
      </div>

      {config.isTestMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 pt-3 border-t border-border"
        >
          <div className="flex items-center gap-2 text-sm text-orange-600">
            <TestTube className="w-4 h-4" />
            <span className="font-medium">Test Mode Active</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            All crypto payments will use testnet currencies. No real
            transactions will be processed.
          </p>

          <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-900/10 rounded-md">
            <p className="text-xs text-orange-700 dark:text-orange-300 font-medium mb-1">
              Available Testnet Currencies:
            </p>
            <div className="flex flex-wrap gap-1">
              {config.currencies.map((currency) => (
                <span
                  key={currency.id}
                  className="text-xs bg-orange-100 dark:bg-orange-800 text-orange-700 dark:text-orange-300 px-2 py-1 rounded"
                >
                  {currency.symbol}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TestModeToggle;
