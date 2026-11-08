
import { useState } from "react";
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
  Receipt,
  Landmark,
} from "lucide-react";

import MetricCard from "../components/dashboard/MetricCard";
import { useAccount } from "../context/AccountContext";

const formatMoney = (value) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

export default function Overview() {
  const { account, accountId, loading, error, loadAccount, isMockMode } =
    useAccount();

  const [accountInput, setAccountInput] = useState(accountId || "1234");

  async function handleLookup(event) {
    event.preventDefault();
    await loadAccount(accountInput);
  }

  return (
    <div className="overview-page">
      <div className="page-heading">
        <h1>Financial Overview</h1>
        <p>
          Understand a customer's financial position before testing a shock.
        </p>
      </div>

      <form className="account-search" onSubmit={handleLookup}>
        <div>
          <label htmlFor="account-id">Customer Account ID</label>
          <input
            id="account-id"
            type="number"
            min="1"
            value={accountInput}
            onChange={(event) => setAccountInput(event.target.value)}
            placeholder="Enter account ID"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Load Account"}
        </button>
      </form>

      {isMockMode && (
        <p className="demo-data-notice">
          Demo mode: displaying illustrative customer profiles.
        </p>
      )}

      {error && (
        <p className="account-error" role="alert">
          {error}
        </p>
      )}

      {account && (
        <>
          <div className="account-summary">
            <div>
              <span className="summary-label">CUSTOMER PROFILE</span>
              <h2>Account #{account.account_id}</h2>
              <p>Monthly financial baseline</p>
            </div>

            <span className="account-status">Profile loaded</span>
          </div>

          <div className="metrics-grid">
            <MetricCard
              label="Monthly Income"
              value={formatMoney(account.typical_income)}
              description="Typical monthly money in"
              icon={ArrowDownCircle}
            />

            <MetricCard
              label="Monthly Spending"
              value={formatMoney(account.typical_spending)}
              description="Typical monthly money out"
              icon={ArrowUpCircle}
            />

            <MetricCard
              label="Cash Buffer"
              value={formatMoney(account.buffer)}
              description="Estimated available balance"
              icon={Wallet}
              accent
            />

            <MetricCard
              label="Monthly Cash Flow"
              value={formatMoney(account.monthly_cashflow)}
              description="Income minus spending"
              icon={TrendingUp}
            />
          </div>

          <div className="breakdown-card">
            <h3>Monthly Expense Breakdown</h3>
            <p>
              Additional inputs used in the financial shock simulator.
            </p>

            <div className="breakdown-grid">
              <div className="breakdown-item">
                <Receipt size={20} />
                <span>Fixed Costs</span>
                <strong>{formatMoney(account.fixed_costs)}</strong>
              </div>

              <div className="breakdown-item">
                <Landmark size={20} />
                <span>Household Bills</span>
                <strong>{formatMoney(account.household_bills)}</strong>
              </div>

              <div className="breakdown-item">
                <Wallet size={20} />
                <span>Loan Payment</span>
                <strong>{formatMoney(account.loan_payment)}</strong>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}