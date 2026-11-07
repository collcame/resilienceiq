import os
import pandas as pd
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["Simulation"])

# Define path to the root-level 'data' folder
DATA_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "data")
)


def load_csv(filename: str):
  path = os.path.join(DATA_DIR, filename)
  if not os.path.exists(path):
    raise HTTPException(
        status_code=404, detail=f"Dataset {filename} not found in data directory."
    )
  return pd.read_csv(path)


# Pydantic model matching Member 1's requested JSON body
class SimulationRequest(BaseModel):
  account_id: int
  income_replacement_pct: float
  household_bills_increase_pct: float
  one_off_cost: float


@router.post("/simulate")
def run_simulation(payload: SimulationRequest):
  """Runs a financial stress test/simulation querying actual CSV data."""
  try:
    accounts = load_csv("accounts.csv")
    monthly_summary = load_csv("monthly_summary.csv")

    # 1. Find the specific account by account_id
    # (Adjust column name 'account_id' if your CSV header differs, e.g., 'id')
    account_match = accounts[accounts["account_id"] == payload.account_id]
    
    if account_match.empty:
      raise HTTPException(
          status_code=404, detail=f"Account ID {payload.account_id} not found."
      )

    # Extract starting balance/buffer from accounts.csv (e.g., 'balance')
    starting_balance = float(account_match.iloc[0].get("balance", 10000.0))

    # 2. Find monthly summary data for this account
    summary_match = monthly_summary[monthly_summary["account_id"] == payload.account_id]

    if not summary_match.empty:
      # Use historical averages or latest month if available
      baseline_income = float(summary_match.iloc[-1].get("income", 4000.0))
      baseline_spending = float(summary_match.iloc[-1].get("spending", 2500.0))
    else:
      # Fallback defaults if no summary history exists for this account
      baseline_income = 4000.0
      baseline_spending = 2500.0

    # 3. Apply simulation shock formulas
    income_after_shock = baseline_income * (payload.income_replacement_pct / 100.0)
    spending_after_shock = baseline_spending * (1 + payload.household_bills_increase_pct / 100.0)

    buffer_left = max(0.0, starting_balance - payload.one_off_cost)
    monthly_shortfall = max(0.0, spending_after_shock - income_after_shock)

    if monthly_shortfall > 0:
      runway_months = round(buffer_left / monthly_shortfall, 1)
      no_shortfall = False
    else:
      runway_months = 999.0
      no_shortfall = True

    return {
        "income_after_shock": round(income_after_shock, 2),
        "spending_after_shock": round(spending_after_shock, 2),
        "buffer_left": round(buffer_left, 2),
        "monthly_shortfall": round(monthly_shortfall, 2),
        "runway_months": runway_months,
        "no_shortfall": no_shortfall,
    }

  except HTTPException as he:
    raise he
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))