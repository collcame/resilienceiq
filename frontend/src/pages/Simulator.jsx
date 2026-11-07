
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  Clock3,
  Wallet,
  Play,
} from "lucide-react";

import { useAccount } from "../context/AccountContext";
import { simulateShock } from "../services/simulationService";

const formatMoney = (value) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

const initialInputs = {
  income_replacement_pct: 55,
  household_bills_increase_pct: 15,
  one_off_cost: 1000,
};

export default function Simulator() {
  const { account, isMockMode } = useAccount();

  const [inputs, setInputs] = useState(initialInputs);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Invalidate old simulation results whenever the selected account changes.
  useEffect(() => {
    setResult(null);
    setError("");
  }, [account?.account_id]);

  function updateInput(name, value) {
    setInputs((current) => ({
      ...current,
      [name]: Number(value),
    }));

    // Results should never appear current after changing the scenario.
    setResult(null);
    setError("");
  }

  async function handleSimulation(event) {
    event.preventDefault();

    if (!account) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await simulateShock(account, inputs);
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!account) {
    return (
      <section>
        <h1>Shock Simulator</h1>
        <p>
          No customer selected.{" "}
          <Link to="/overview">Select an account first.</Link>
        </p>
      </section>
    );
  }

  return (
    <section className="simulator-page">
      <div className="page-heading">
        <h1>Financial Shock Simulator</h1>
        <p>
          Model how unexpected financial events affect a customer's
          ability to cover expenses.
        </p>
      </div>

      <div className="simulator-account-banner">
        <div>
          <span className="summary-label">SELECTED CUSTOMER</span>
          <h2>Account #{account.account_id}</h2>
          <p>Current cash buffer: {formatMoney(account.buffer)}</p>
        </div>
        <Link to="/overview">Change Account</Link>
      </div>

      {isMockMode && (
        <p className="demo-data-notice">
          Demo mode: simulation uses illustrative customer data.
        </p>
      )}

      <div className="simulator-layout">
        <form className="simulator-controls" onSubmit={handleSimulation}>
          <h3>Configure Financial Shock</h3>
          <p>Adjust the scenario to explore different outcomes.</p>

          <div className="shock-control">
            <div className="shock-control-heading">
              <label htmlFor="income-replacement">
                Income Replacement
              </label>
              <strong>{inputs.income_replacement_pct}%</strong>
            </div>
            <input
              id="income-replacement"
              type="range"
              min="0"
              max="100"
              step="5"
              value={inputs.income_replacement_pct}
              onChange={(e) =>
                updateInput("income_replacement_pct", e.target.value)
              }
            />
            <small>
              Percentage of normal income remaining during the shock.
            </small>
          </div>

          <div className="shock-control">
            <div className="shock-control-heading">
              <label htmlFor="bills-increase">
                Household Bills Increase
              </label>
              <strong>{inputs.household_bills_increase_pct}%</strong>
            </div>
            <input
              id="bills-increase"
              type="range"
              min="0"
              max="100"
              step="5"
              value={inputs.household_bills_increase_pct}
              onChange={(e) =>
                updateInput("household_bills_increase_pct", e.target.value)
              }
            />
            <small>
              Additional household bills as a percentage of baseline bills.
            </small>
          </div>

          <div className="shock-control">
            <div className="shock-control-heading">
              <label htmlFor="emergency-cost">
                One-Time Emergency Cost
              </label>
              <strong>{formatMoney(inputs.one_off_cost)}</strong>
            </div>
            <input
              id="emergency-cost"
              type="range"
              min="0"
              max="10000"
              step="250"
              value={inputs.one_off_cost}
              onChange={(e) =>
                updateInput("one_off_cost", e.target.value)
              }
            />
            <small>
              An immediate expense deducted from the available buffer.
            </small>
          </div>

          <button
            type="submit"
            className="simulate-button"
            disabled={loading}
          >
            <Play size={18} />
            {loading ? "Running Simulation..." : "Run Simulation"}
          </button>

          {error && (
            <p className="account-error" role="alert">
              {error}
            </p>
          )}
        </form>

        <div className="simulator-results">
          <h3>Simulation Results</h3>
          <p>
            {result
              ? "Projected financial position after the shock."
              : "Configure your scenario and run the simulation."}
          </p>

          {result ? (
            <>
              <div className="simulation-results-grid">
                <div className="simulation-result-card">
                  <ArrowDownCircle size={21} />
                  <span>Income After Shock</span>
                  <strong>
                    {formatMoney(result.income_after_shock)}
                  </strong>
                </div>

                <div className="simulation-result-card">
                  <ArrowUpCircle size={21} />
                  <span>Spending After Shock</span>
                  <strong>
                    {formatMoney(result.spending_after_shock)}
                  </strong>
                </div>

                <div className="simulation-result-card">
                  <Wallet size={21} />
                  <span>Remaining Cash Buffer</span>
                  <strong>{formatMoney(result.buffer_left)}</strong>
                </div>

                <div className="simulation-result-card">
                  <AlertTriangle size={21} />
                  <span>Monthly Shortfall</span>
                  <strong>
                    {formatMoney(result.monthly_shortfall)}
                  </strong>
                </div>
              </div>

              <div className="runway-highlight">
                <div>
                  <Clock3 size={25} />
                  <span>Estimated Financial Runway</span>
                </div>

                <strong>
                  {result.no_shortfall && result.runway_months >= 120
                    ? "120+"
                    : Number(result.runway_months).toFixed(1)}
                  <small> months</small>
                </strong>

                <p>
                  {result.no_shortfall
                    ? "Monthly income covers projected spending under this scenario."
                    : "Estimated time the remaining cash buffer can cover the monthly shortfall."}
                </p>
              </div>

              <Link to="/action-plan" className="action-plan-link">
                View Personalized Action Plan
              </Link>
            </>
          ) : (
            <div className="simulation-empty">
              <Clock3 size={36} />
              <strong>No simulation results yet</strong>
              <span>
                Adjust the financial shock controls and select Run Simulation.
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}