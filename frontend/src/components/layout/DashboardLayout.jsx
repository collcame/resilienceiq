
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  SlidersHorizontal,
  ClipboardList,
  ChartNoAxesCombined,
  ShieldCheck,
  Wallet,
} from "lucide-react";

const navigation = [
  { name: "Overview", path: "/overview", icon: LayoutDashboard },
  { name: "Shock Simulator", path: "/simulator", icon: SlidersHorizontal },
  { name: "Action Plan", path: "/action-plan", icon: ClipboardList },
  { name: "Population Insights", path: "/insights", icon: ChartNoAxesCombined },
  { name: "Resilience Vault", path: "/vault", icon: Wallet },
];

export default function DashboardLayout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <ShieldCheck size={30} />
          <span>ResilienceIQ</span>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          {navigation.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          Sheridan Datathon 2026
          <small>Tangerine Sponsor Challenge</small>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div>
            <strong>Financial Resilience Workspace</strong>
            <p>Understand. Prepare. Recover.</p>
          </div>
          <span className="prototype-tag">Datathon Prototype</span>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}