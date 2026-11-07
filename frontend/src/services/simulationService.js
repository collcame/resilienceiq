
import axios from "axios";
import { isMockMode } from "./accountService";

export function calculateMockSimulation(account, inputs) {
  const {
    income_replacement_pct,
    household_bills_increase_pct,
    one_off_cost,
  } = inputs;

  const incomeAfter =
    account.typical_income * (income_replacement_pct / 100);

  const spendingAfter =
    account.typical_spending +
    account.household_bills * (household_bills_increase_pct / 100);

  const bufferLeft = account.buffer - one_off_cost;
  const monthlyGap = spendingAfter - incomeAfter;
  const monthlyShortfall = Math.max(0, monthlyGap);
  const noShortfall = monthlyGap <= 0;

  let runwayMonths;

  if (bufferLeft <= 0) {
    runwayMonths = 0;
  } else if (noShortfall) {
    runwayMonths = 120;
  } else {
    runwayMonths = Math.round(
      Math.min(bufferLeft / monthlyGap, 120) * 10
    ) / 10;
  }

  return {
    account_id: account.account_id,
    income_after_shock: Math.round(incomeAfter * 100) / 100,
    spending_after_shock: Math.round(spendingAfter * 100) / 100,
    buffer_left: Math.round(bufferLeft * 100) / 100,
    monthly_shortfall: Math.round(monthlyShortfall * 100) / 100,
    runway_months: runwayMonths,
    no_shortfall: noShortfall,
  };
}

export async function simulateShock(account, inputs) {
  if (!account) {
    throw new Error("Please select an account first.");
  }

  if (isMockMode) {
    return calculateMockSimulation(account, inputs);
  }

  try {
    const response = await axios.post("/api/simulate", {
      account_id: account.account_id,
      ...inputs,
    });

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail ||
      "Unable to run simulation. Check the backend connection."
    );
  }
}