import React from "react";
import { Shield, Lock, ArrowUpRight, Coins } from "lucide-react";

export default function Vault() {
  return (
    <section className="vault-page">
      <div className="page-heading">
        <h1>Resilience Vault</h1>
        <p>Explore optional blockchain-backed savings commitments and automated buffer locks.</p>
      </div>

      <div className="metrics-grid" style={{ marginTop: "24px" }}>
        <div className="breakdown-card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <Lock className="text-orange-500" size={28} color="#f36b21" />
            <h3 style={{ margin: 0 }}>Active Buffer Lock</h3>
          </div>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "16px" }}>
            Locked savings commitment designed to safeguard against sudden monthly spending shocks and unexpected income volatility.
          </p>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "#0f172a" }}>$2,500.00 CAD</div>
          <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: "600" }}>● Fully Secured & Automated</span>
        </div>

        <div className="breakdown-card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <Shield className="text-orange-500" size={28} color="#f36b21" />
            <h3 style={{ margin: 0 }}>Smart Yield Rate</h3>
          </div>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "16px" }}>
            Earn optimized risk-free yield generation on your emergency cash reserves while keeping liquidity intact.
          </p>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "#16a34a" }}>4.8% APY</div>
          <span style={{ fontSize: "12px", color: "#64748b" }}>Compounded daily</span>
        </div>
      </div>

      <div className="breakdown-card" style={{ marginTop: "24px", padding: "24px" }}>
        <h3>Commitment History & Vault Status</h3>
        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>
          Overview of smart contract allocations tied to your ResilienceIQ profile.
        </p>
        <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong>Monthly Auto-Contribution</strong>
            <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>$150.00 routed on the 1st of every month</p>
          </div>
          <span style={{ background: "#dcfce7", color: "#16a34a", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>Active</span>
        </div>
      </div>
    </section>
  );
}