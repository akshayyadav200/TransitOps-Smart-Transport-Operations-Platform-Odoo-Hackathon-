import { CarFront, ClipboardCheck, UserRound } from "lucide-react";
import { createElement } from "react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/AuthContext.jsx";
import { ComplianceView } from "./compliance/ComplianceView.jsx";
import { DriversView } from "./drivers/DriversView.jsx";
import { VehiclesView } from "./vehicles/VehiclesView.jsx";

const TABS = [
  ["vehicles", "Vehicles", CarFront, ["Admin", "Fleet Manager"]],
  ["drivers", "Drivers", UserRound, ["Admin", "Fleet Manager", "Safety Officer"]],
  ["compliance", "Compliance", ClipboardCheck, ["Admin", "Fleet Manager", "Safety Officer"]]
];

export function FleetWorkspace({ initialTab = "vehicles" }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  const visibleTabs = useMemo(() => TABS.filter(([, , , roles]) => roles.includes(user.role)), [user.role]);
  const canManageDrivers = ["Admin", "Fleet Manager"].includes(user.role);

  useEffect(() => {
    if (!visibleTabs.some(([key]) => key === activeTab)) {
      setActiveTab(visibleTabs[0]?.[0] ?? "drivers");
    }
  }, [activeTab, visibleTabs]);

  return (
      <section className="fleet-workspace">
        <header className="fleet-header">
          <div>
            <p className="eyebrow">TransitOps</p>
            <h1>Fleet & Driver Operations</h1>
            <p className="summary">
              Manage dispatch-ready vehicles, qualified drivers, and compliance signals from one focused workspace.
            </p>
          </div>
          <nav className="tab-list" aria-label="Fleet module tabs">
            {visibleTabs.map(([key, label, Icon]) => (
              <button className={activeTab === key ? "tab active" : "tab"} key={key} onClick={() => setActiveTab(key)} type="button">
                {createElement(Icon, { size: 18, "aria-hidden": "true" })}
                {label}
              </button>
            ))}
          </nav>
        </header>

        {activeTab === "vehicles" && <VehiclesView />}
        {activeTab === "drivers" && <DriversView canManage={canManageDrivers} />}
        {activeTab === "compliance" && <ComplianceView />}
      </section>
  );
}
