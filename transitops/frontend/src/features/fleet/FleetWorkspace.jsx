import { BarChart3, CarFront, ClipboardCheck, FileText, Fuel, Gauge, ReceiptText, UserRound } from "lucide-react";
import { createElement } from "react";
import { useState } from "react";
import { DashboardView } from "../bi/DashboardView.jsx";
import { ExpensesView } from "../bi/ExpensesView.jsx";
import { FiltersProvider } from "../bi/FiltersContext.jsx";
import { FuelView } from "../bi/FuelView.jsx";
import { GlobalFilters } from "../bi/GlobalFilters.jsx";
import { ReportsView } from "../bi/ReportsView.jsx";
import { ComplianceView } from "./compliance/ComplianceView.jsx";
import { DriversView } from "./drivers/DriversView.jsx";
import { VehiclesView } from "./vehicles/VehiclesView.jsx";

const TABS = [
  ["dashboard", "Dashboard", Gauge],
  ["analytics", "Analytics", BarChart3],
  ["fuel", "Fuel", Fuel],
  ["expenses", "Expenses", ReceiptText],
  ["reports", "Reports", FileText],
  ["vehicles", "Vehicles", CarFront],
  ["drivers", "Drivers", UserRound],
  ["compliance", "Compliance", ClipboardCheck]
];

export function FleetWorkspace() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <main className="shell">
      <FiltersProvider>
        <section className="workspace fleet-workspace">
          <header className="fleet-header">
            <div>
              <p className="eyebrow">TransitOps</p>
              <h1>Smart Transport Operations Platform</h1>
              <p className="summary">
                Monitor fleet performance, fuel consumption, expenses, reports, and compliance from one operational workspace.
              </p>
            </div>
            <nav className="tab-list" aria-label="TransitOps module tabs">
              {TABS.map(([key, label, Icon]) => (
                <button className={activeTab === key ? "tab active" : "tab"} key={key} onClick={() => setActiveTab(key)} type="button">
                  {createElement(Icon, { size: 18, "aria-hidden": "true" })}
                  {label}
                </button>
              ))}
            </nav>
          </header>

          <GlobalFilters />

          {activeTab === "dashboard" && <DashboardView />}
          {activeTab === "analytics" && <DashboardView chartsOnly />}
          {activeTab === "fuel" && <FuelView />}
          {activeTab === "expenses" && <ExpensesView />}
          {activeTab === "reports" && <ReportsView />}
          {activeTab === "vehicles" && <VehiclesView />}
          {activeTab === "drivers" && <DriversView />}
          {activeTab === "compliance" && <ComplianceView />}
        </section>
      </FiltersProvider>
    </main>
  );
}
