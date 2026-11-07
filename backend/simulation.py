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
  """Runs a financial stress test/simulation based on Member 1's API contract."""
  try:
    accounts = load_csv("accounts.csv")
    monthly_summary = load_csv("monthly_summary.csv")

    # TODO: Connect these calculations to real columns in your CSV files
    income_after_shock = 4000.0 * (payload.income_replacement_pct / 100.0)
    spending_after_shock = 2500.0 * (
        1 + payload.household_bills_increase_pct / 100.0
    )

    buffer_left = max(0.0, 10000.0 - payload.one_off_cost)
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

  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))