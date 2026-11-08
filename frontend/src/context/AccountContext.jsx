
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { getAccount, isMockMode } from "../services/accountService";

const AccountContext = createContext(null);

export function AccountProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [accountId, setAccountId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAccount = useCallback(async (id) => {
    setLoading(true);
    setError("");
    setAccount(null);
    setAccountId("");

    try {
      const profile = await getAccount(id);

      setAccount(profile);
      setAccountId(String(profile.account_id));

      return profile;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isMockMode) {
      loadAccount(1234);
    }
  }, [loadAccount]);

  return (
    <AccountContext.Provider
      value={{
        account,
        accountId,
        loading,
        error,
        loadAccount,
        isMockMode,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);

  if (!context) {
    throw new Error("useAccount must be used inside AccountProvider");
  }

  return context;
}