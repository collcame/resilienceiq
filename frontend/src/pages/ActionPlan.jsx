
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  AlertTriangle,
  Clock3,
  ClipboardList,
  Wallet,
} from "lucide-react";

import { useAccount } from "../context/AccountContext";
import { useSimulation } from "../context/SimulationContext";

const formatMoney = (value) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

export default function ActionPlan() {
  const { account, isMockMode } = useAccount();
  const { simulation } = useSimulation();

  if (!account) {
    return (
      <section>
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

  return (
    <section className="action-plan-page">
      <div className="page-heading">
        <h1>Personalized Action Plan</h1>
        <p>
          Review the financial impact of your selected shock and
          prepare a recovery strategy.
        </p>
      </div>

      {isMockMode && (
        <p className="demo-data-notice">
          Demo mode: results are based on illustrative customer data.
        </p>
      )}

      <div className="plan-account-banner">
        <div>
          <span className="summary-label">CUSTOMER SCENARIO</span>
          <h2>Account #{account.account_id}</h2>
          <p>Results from your most recent financial shock simulation.</p>
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
          <strong>{formatMoney(simulation.monthly_shortfall)}</strong>
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
          <strong>{formatMoney(simulation.buffer_left)}</strong>
        </div>
      </div>

      <div className="plan-recommendations">
        <div className="recommendations-heading">
          <ClipboardList size={24} />
          <div>
            <h3>Recommended Recovery Actions</h3>
            <p>
              Personalized recommendations will be generated
              by the financial planning engine.
            </p>
          </div>
        </div>

        <div className="recommendations-placeholder">
          <ClipboardList size={35} />
          <strong>Planning engine integration pending</strong>
          <p>
            The financial impact is ready. The next integration
            will use Member 3's planning API to generate
            actionable recommendations for this scenario.
          </p>
        </div>
      </div>
    </section>
  );
}