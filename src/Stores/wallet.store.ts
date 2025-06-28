import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Wallet, Transaction } from "@/Types/types";

interface WalletState {
  wallet: Wallet | null;
  transactions: Transaction[];
  isLoading: boolean;
  setWallet: (wallet: Wallet) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateBalance: (amount: number) => void;
  getRecentTransactions: (limit?: number) => Transaction[];
  getTransactionById: (id: string) => Transaction | undefined;
}

const initialWallet: Wallet = {
  id: "default-wallet",
  userId: "default-user",
  balance: 0,
  currency: "USD",
};

export const useWalletStore = create<WalletState>()(
  persist(
    devtools(
      (set, get) => ({
        wallet: initialWallet,
        transactions: [],
        isLoading: false,

        setWallet: (wallet: Wallet) => {
          set({ wallet });
        },

        addTransaction: (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
          const newTransaction: Transaction = {
            ...transactionData,
            id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
          };

          set((state) => {
            const newTransactions = [newTransaction, ...state.transactions];
            
            // Update wallet balance
            const newBalance = state.wallet 
              ? state.wallet.balance + (newTransaction.type === 'credit' ? newTransaction.amount : -newTransaction.amount)
              : 0;

            return {
              transactions: newTransactions,
              wallet: state.wallet ? { ...state.wallet, balance: newBalance } : null,
            };
          });
        },

        updateBalance: (amount: number) => {
          set((state) => ({
            wallet: state.wallet ? { ...state.wallet, balance: amount } : null,
          }));
        },

        getRecentTransactions: (limit = 10) => {
          const { transactions } = get();
          return transactions.slice(0, limit);
        },

        getTransactionById: (id: string) => {
          const { transactions } = get();
          return transactions.find((transaction) => transaction.id === id);
        },
      }),
      { name: "wallet-devtools" }
    ),
    {
      name: "wallet-storage",
    }
  )
); 