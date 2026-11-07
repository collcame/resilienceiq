
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAccount } from "./AccountContext";

const SimulationContext = createContext(null);

export const defaultShockInputs = {
  income_replacement_pct: 55,
  household_bills_increase_pct: 15,
  one_off_cost: 1000,
};

export function SimulationProvider({ children }) {
  const { account } = useAccount();

  const [inputs, setInputs] = useState(defaultShockInputs);
  const [result, setResult] = useState(null);
  const [simulatedAccountId, setSimulatedAccountId] = useState(null);

  // A simulation is valid only for the account that produced it.
  const simulation =
    account &&
    result &&
    simulatedAccountId === account.account_id
      ? result
      : null;

  // Clear results when switching accounts.
  useEffect(() => {
    setResult(null);
    setSimulatedAccountId(null);
  }, [account?.account_id]);

  function updateInput(name, value) {
    setInputs((current) => ({
      ...current,
      [name]: Number(value),
    }));

    setResult(null);
    setSimulatedAccountId(null);
  }

  function saveSimulation(accountId, simulationResult) {
    setSimulatedAccountId(accountId);
    setResult(simulationResult);
  }

  function clearSimulation() {
    setResult(null);
    setSimulatedAccountId(null);
  }

  return (
    <SimulationContext.Provider
      value={{
        inputs,
        updateInput,
        simulation,
        saveSimulation,
        clearSimulation,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);

  if (!context) {
    throw new Error(
      "useSimulation must be used inside SimulationProvider"
    );
  }

  return context;
}