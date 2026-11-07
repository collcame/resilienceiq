
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  AlertTriangle,
  Clock3,
  ClipboardList,
  Wallet,
  PiggyBank,
  Target,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

import { useAccount } from "../context/AccountContext";
import { useSimulation } from "../context/SimulationContext";
import { generateActionPlan } from "../services/planningService";
import { apiConfig } from "../config/apiConfig";

const formatMoney = (value) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

function formatUrgency(value) {
  if (!value) return "Not available";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function ActionPlan() {
  const { account, isMockMode } = useAccount();
  const { simulation } = useSimulation();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const accountId = account?.account_id;
  const monthlyShortfall = simulation?.monthly_shortfall;
  const runwayMonths = simulation?.runway_months;
  const bufferLeft = simulation?.buffer_left;

  useEffect(() => {
    let cancelled = false;

    setPlan(null);
    setError("");

    if (!accountId || !simulation) {
      setLoading(false);
      return;
    }

    async function loadPlan() {
      setLoading(true);

      try {
        const response = await generateActionPlan(
          { account_id: accountId },
          {
            monthly_shortfall: monthlyShortfall,
            runway_months: runwayMonths,
            buffer_left: bufferLeft,
          }
        );

        if (!cancelled) {
          setPlan(response);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPlan();

    return () => {
      cancelled = true;
    };
  }, [
    accountId,
    monthlyShortfall,
    runwayMonths,
    bufferLeft,
    retryCount,
  ]);

  if (!account) {
    return (
      <section className="action-plan-page">
        <h1>Personalized Action Plan</h1>
        <p>
          No customer selected.{" "}
          <Link to="/overview">Select an account first.</Link>
        </p>
      </section>
    );
  }

  if (!simulation) {
    return (
      <section className="action-plan-page">
        <h1>Personalized Action Plan</h1>
        <p>Account #{account.account_id}</p>

        <div className="plan-empty-state">
          <ClipboardList size={42} />
          <h2>No simulation available</h2>
          <p>
            Run a financial shock simulation first to prepare
            a personalized action plan.
          </p>
          <Link to="/simulator" className="plan-primary-link">
            Go to Shock Simulator
          </Link>
        </div>
      </section>
    );
  }

  const isReady = plan?.status === "ready";

  return (
    <section className="action-plan-page">
      <div className="page-heading">
        <h1>Personalized Action Plan</h1>
        <p>
          Review the financial impact of your selected shock and
          prepare a recovery strategy.
        </p>
      </div>

      {(isMockMode || apiConfig.mockSimulation) && (
        <p className="demo-data-notice">
          Demo mode: results are based on illustrative
          customer data or simulated calculations.
        </p>
      )}

      <div className="plan-account-banner">
        <div>
          <span className="summary-label">
            CUSTOMER SCENARIO
          </span>
          <h2>Account #{account.account_id}</h2>
          <p>
            Results from your most recent financial
            shock simulation.
          </p>
        </div>

        <Link to="/simulator">
          <ArrowLeft size={17} />
          Modify Scenario
        </Link>
      </div>

      <div className="plan-metrics-grid">
        <div className="plan-metric">
          <AlertTriangle size={23} />
          <span>Monthly Shortfall</span>
          <strong>
            {formatMoney(simulation.monthly_shortfall)}
          </strong>
        </div>

        <div className="plan-metric">
          <Clock3 size={23} />
          <span>Financial Runway</span>
          <strong>
            {simulation.no_shortfall &&
            simulation.runway_months >= 120
              ? "120+"
              : Number(simulation.runway_months).toFixed(1)}
            <small> months</small>
          </strong>
        </div>

        <div className="plan-metric">
          <Wallet size={23} />
          <span>Remaining Cash Buffer</span>
          <strong>
            {formatMoney(simulation.buffer_left)}
          </strong>
        </div>
      </div>

      <div className="plan-recommendations">
        <div className="recommendations-heading">
          <ClipboardList size={24} />
          <div>
            <h3>Recommended Recovery Actions</h3>
            <p>
              Personalized guidance based on the
              selected financial shock.
            </p>
          </div>
        </div>

        {loading && (
          <div
            className="recommendations-placeholder"
            role="status"
          >
            <RefreshCw
              size={35}
              className="plan-loading-icon"
            />
            <strong>Generating your action plan...</strong>
            <p>
              Analyzing the financial impact and
              preparing recommendations.
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="recommendations-placeholder">
            <AlertTriangle size={35} />
            <strong>Unable to generate action plan</strong>
            <p role="alert">{error}</p>

            <button
              type="button"
              className="plan-retry-button"
              onClick={() =>
                setRetryCount((count) => count + 1)
              }
            >
              <RefreshCw size={17} />
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && !isReady && (
          <div className="recommendations-placeholder">
            <ClipboardList size={35} />
            <strong>Planning engine integration pending</strong>
            <p>
              The financial impact is ready.
              Personalized recommendations will appear
              here when the planning API is connected.
            </p>
          </div>
        )}

        {!loading && !error && isReady && (
          <div className="plan-generated-results">
            <div className="plan-urgency">
              <AlertTriangle size={21} />
              <span>Financial Urgency</span>
              <strong>
                {formatUrgency(plan.urgency_level)}
              </strong>
            </div>

            <div className="plan-savings-grid">
              <div className="plan-savings-card">
                <Target size={25} />
                <span>Emergency Buffer Target</span>
                <strong>
                  {formatMoney(plan.target_buffer)}
                </strong>
              </div>

              <div className="plan-savings-card">
                <PiggyBank size={25} />
                <span>Suggested Monthly Savings</span>
                <strong>
                  {formatMoney(
                    plan.suggested_monthly_savings
                  )}
                </strong>
              </div>
            </div>

            <div className="plan-actions-list">
              <h4>Your Recommended Actions</h4>

              {plan.recommended_actions.length > 0 ? (
                <ol>
                  {plan.recommended_actions.map(
                    (action, index) => (
                      <li key={index}>
                        <CheckCircle2 size={21} />
                        <span>{action}</span>
                      </li>
                    )
                  )}
                </ol>
              ) : (
                <p>
                  No additional recommendations
                  were returned for this scenario.
                </p>
              )}
            </div>

            <p className="plan-guidance-note">
              Recommendations are estimates based on
              available financial information and
              should be reviewed before taking action.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}