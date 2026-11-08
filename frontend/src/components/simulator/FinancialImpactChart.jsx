
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const formatMoney = (value) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

export default function FinancialImpactChart({
  account,
  simulation,
}) {
  if (!account || !simulation) return null;

  const data = [
    {
      scenario: "Before Shock",
      income: account.typical_income,
      spending: account.typical_spending,
    },
    {
      scenario: "After Shock",
      income: simulation.income_after_shock,
      spending: simulation.spending_after_shock,
    },
  ];

  return (
    <div className="financial-impact-chart">
      <div className="chart-heading">
        <h3>Before vs. After Financial Shock</h3>
        <p>
          Compare monthly income and spending before and after
          the selected scenario.
        </p>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="scenario"
              tick={{ fill: "#64748b", fontSize: 12 }}
            />

            <YAxis
              tickFormatter={(value) =>
                `$${(value / 1000).toFixed(0)}k`
              }
              tick={{ fill: "#64748b", fontSize: 12 }}
            />

            <Tooltip
              formatter={(value) => formatMoney(value)}
            />

            <Legend />

            <Bar
              dataKey="income"
              name="Monthly Income"
              fill="#f36b21"
              radius={[6, 6, 0, 0]}
            />

            <Bar
              dataKey="spending"
              name="Monthly Spending"
              fill="#334155"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}