import { CarFront, ClipboardCheck, UserRound } from "lucide-react";
import { createElement } from "react";
import { useState } from "react";
import { ComplianceView } from "./compliance/ComplianceView.jsx";
import { DriversView } from "./drivers/DriversView.jsx";
import { VehiclesView } from "./vehicles/VehiclesView.jsx";

const TABS = [
  ["vehicles", "Vehicles", CarFront],
  ["drivers", "Drivers", UserRound],
  ["compliance", "Compliance", ClipboardCheck]
];

export function FleetWorkspace() {
  const [activeTab, setActiveTab] = useState("vehicles");

  return (
    <main className="shell">
      <section className="workspace fleet-workspace">
        <header className="fleet-header">
          <div>
            <p className="eyebrow">TransitOps</p>
            <h1>Fleet & Driver Operations</h1>
            <p className="summary">
              Manage dispatch-ready vehicles, qualified drivers, and compliance signals from one focused workspace.
            </p>
          </div>
          <nav className="tab-list" aria-label="Fleet module tabs">
            {TABS.map(([key, label, Icon]) => (
              <button className={activeTab === key ? "tab active" : "tab"} key={key} onClick={() => setActiveTab(key)} type="button">
                {createElement(Icon, { size: 18, "aria-hidden": "true" })}
                {label}
              </button>
            ))}
          </nav>
        </header>

        {activeTab === "vehicles" && <VehiclesView />}
        {activeTab === "drivers" && <DriversView />}
        {activeTab === "compliance" && <ComplianceView />}
      </section>
    </main>
  );
}
