
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import MetricCard from "../components/dashboard/MetricCard";

const formatMoney = (value) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

export default function Insights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchInsights() {
      try {
        setLoading(true);
        const response = await axios.get("/api/insights");
        setData(response.data);
        setError("");
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            "Unable to load population insights. Please check the backend connection."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, []);

  if (loading) {
    return (
      <section className="insights-page">
        <h1>Population Insights</h1>
        <p>Explore financial resilience patterns across customers.</p>
        <div className="recommendations-placeholder" role="status">
          <RefreshCw size={35} className="plan-loading-icon" />
          <strong>Loading population data...</strong>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="insights-page">
        <h1>Population Insights</h1>
        <p>Explore financial resilience patterns across customers.</p>
        <div className="recommendations-placeholder">
          <AlertTriangle size={35} />
          <strong>Unable to load insights</strong>
          <p role="alert">{error}</p>
        </div>
      </section>
    );
  }

  // Transform risk_distribution object into an array for Recharts
  const riskChartData = data?.risk_distribution
    ? Object.keys(data.risk_distribution).map((key) => ({
        category: key,
        count: data.risk_distribution[key],
      }))
    : [];

  return (
    <section className="insights-page">
      <div className="page-heading">
        <h1>Population Insights</h1>
        <p>Explore financial resilience patterns and risk distribution across the customer base.</p>
      </div>

      <div className="metrics-grid">
        <MetricCard
          label="Total Analyzed Accounts"
          value={data?.total_accounts?.toLocaleString() ?? 0}
          description="Total active client profiles evaluated"
          icon={Users}
        />

        <MetricCard
          label="Population Average Balance"
          value={formatMoney(data?.average_balance)}
          description="Average cash buffer across base"
          icon={Wallet}
          accent
        />

        <MetricCard
          label="Population Average Income"
          value={formatMoney(data?.average_income)}
          description="Typical monthly income"
          icon={ArrowDownCircle}
        />

        <MetricCard
          label="Population Average Spending"
          value={formatMoney(data?.average_spending)}
          description="Typical monthly outflow"
          icon={ArrowUpCircle}
        />
      </div>

      <div className="breakdown-card" style={{ marginTop: "24px" }}>
        <h3>Financial Runway Risk Distribution</h3>
        <p>Breakdown of customer resilience levels based on available cash buffer versus monthly spending.</p>

        <div className="chart-container" style={{ marginTop: "20px" }}>
          <ResponsiveContainer width="100%\" height={320}>
            <BarChart
              data={riskChartData}
              margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="category" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" name="Number of Accounts" fill="#f36b21" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}