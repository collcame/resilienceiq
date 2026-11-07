import os
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ResilienceIQ API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


@app.get("/api/health")
def health():
  return {"status": "ok", "application": "ResilienceIQ"}


@app.get("/api/load-test")
def test_load_data():
  """Verifies that all dataset CSVs load correctly."""
  try:
    clients = load_csv("clients.csv")
    accounts = load_csv("accounts.csv")
    cards = load_csv("cards.csv")
    monthly_summary = load_csv("monthly_summary.csv")

    return {
        "status": "success",
        "message": "All CSV files loaded successfully!",
        "row_counts": {
            "clients": len(clients),
            "accounts": len(accounts),
            "cards": len(cards),
            "monthly_summary": len(monthly_summary),
        },
    }
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/simulation/risk-summary")
def get_risk_summary():
  """Example Simulation & Stress-Testing Endpoint:

  Analyzes credit card usage or balances to spot high-risk indicators.
  """
  try:
    cards = load_csv("cards.csv")
    accounts = load_csv("accounts.csv")

    # Basic example metrics for simulation/stress testing
    total_cards = len(cards)
    total_accounts = len(accounts)

    return {
        "status": "success",
        "simulation_metrics": {
            "total_credit_cards_analyzed": total_cards,
            "total_accounts_analyzed": total_accounts,
            "stress_test_status": "Ready for Monte Carlo / Scenario modeling",
        },
    }
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))