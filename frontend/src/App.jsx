
import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AccountProvider } from "./context/AccountContext";
import { SimulationProvider } from "./context/SimulationContext";

import DashboardLayout from "./components/layout/DashboardLayout";
import Overview from "./pages/Overview";
import Simulator from "./pages/Simulator";
import ActionPlan from "./pages/ActionPlan";
import Insights from "./pages/Insights";
import Vault from "./pages/Vault";

export default function App() {
  return (
    <AccountProvider>
      <SimulationProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Navigate to="/overview" replace />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/simulator" element={<Simulator />} />
              <Route path="/action-plan" element={<ActionPlan />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/vault" element={<Vault />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SimulationProvider>
    </AccountProvider>
  );
}