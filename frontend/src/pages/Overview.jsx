
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
import { mockAccounts } from "../services/mockAccounts";

const formatMoney = (value) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value);

export default function Overview() {
  const [accountInput, setAccountInput] = useState("1234");
  const [account, setAccount] = useState(mockAccounts[1234]);
  const [error, setError] = useState("");

  function loadAccount(event) {
    event.preventDefault();

    const id = Number(accountInput);
    const selected = mockAccounts[id];

    if (!selected) {
      setError("Account not found in the demo dataset.");
      setAccount(null);
      return;
    }

    setAccount(selected);
    setError("");
  }

  return (
    <div className="overview-page">
      <div className="page-heading">
        <h1>Financial Overview</h1>
        <p>
          Understand a customer's financial position before testing a shock.
        </p>
      </div>

      <form className="account-search" onSubmit={loadAccount}>
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
        <button type="submit">Load Account</button>
      </form>

      {error && <p className="account-error" role="alert">{error}</p>}

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
            <p>Additional inputs used in the financial shock simulator.</p>

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