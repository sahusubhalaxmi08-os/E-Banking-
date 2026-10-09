
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { AuthContext } from "./AuthContext";

import {
  getMyAccount,
  getTransactions,
} from "../services/bankingService.js";

export const AccountContext = createContext(null);

export function AccountProvider({ children }) {
  const { user, token } = useContext(AuthContext);

  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requestId = useRef(0);

  const refreshAccounts = useCallback(async () => {
    const currentRequest = ++requestId.current;

    if (!user || !token) {
      setAccounts([]);
      setTransactions([]);
      setError("");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [accountResult, transactionResult] = await Promise.all([
        getMyAccount(token),
        getTransactions(token),
      ]);

      if (currentRequest !== requestId.current) return;

      // Extract account data
      const accountData = Array.isArray(accountResult)
        ? accountResult
        : Array.isArray(accountResult?.accounts)
          ? accountResult.accounts
          : Array.isArray(accountResult?.data?.accounts)
            ? accountResult.data.accounts
            : accountResult?.account
              ? [accountResult.account]
              : accountResult?.data?.account
                ? [accountResult.data.account]
                : accountResult?.accountNumber
                  ? [accountResult]
                  : accountResult?.data?.accountNumber
                    ? [accountResult.data]
                    : [];

      // Extract transaction data from supported API response formats
      const transactionData = Array.isArray(transactionResult)
        ? transactionResult
        : Array.isArray(transactionResult?.data)
          ? transactionResult.data
          : Array.isArray(transactionResult?.transactions)
            ? transactionResult.transactions
            : Array.isArray(transactionResult?.data?.transactions)
              ? transactionResult.data.transactions
              : [];

      console.log("Account API response:", accountResult);
      console.log("Transaction API response:", transactionResult);
      console.log("Loaded transactions:", transactionData);

      setAccounts(accountData);
      setTransactions(transactionData);
    } catch (err) {
      if (currentRequest !== requestId.current) return;

      console.error("Failed to load banking information:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load banking information."
      );

      setAccounts([]);
      setTransactions([]);
    } finally {
      if (currentRequest === requestId.current) {
        setLoading(false);
      }
    }
  }, [user, token]);

  useEffect(() => {
    refreshAccounts();

    return () => {
      requestId.current += 1;
    };
  }, [refreshAccounts]);

  const accountNumber = accounts[0]?.accountNumber || "";

  const totalBalance = accounts.reduce((total, account) => {
    const balance =
      account.balancePaise != null
        ? Number(account.balancePaise) / 100
        : Number(account.balance ?? 0);

    return total + (Number.isFinite(balance) ? balance : 0);
  }, 0);

  return (
    <AccountContext.Provider
      value={{
        accounts,
        accountNumber,
        transactions,
        totalBalance,
        loading,
        error,
        refreshAccounts,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccounts() {
  return useContext(AccountContext);
}