import { useCallback, useEffect, useState } from "react";
import {
  FiActivity,
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiTool,
  FiTruck,
  FiXCircle
} from "react-icons/fi";
import { analyticsApi } from "./biApi.js";
import { ChartsPanel } from "./ChartsPanel.jsx";
import { ErrorState, KpiCard, LoadingState } from "./components.jsx";
import { useGlobalFilters } from "./FiltersContext.jsx";
import { formatCurrency, formatNumber } from "./formatters.js";

function kpiItems(kpis = {}) {
  return [
    ["Active Vehicles", formatNumber(kpis.activeVehicles), "fleet running", FiTruck, "green"],
    ["Available Vehicles", formatNumber(kpis.availableVehicles), "dispatch ready", FiCheckCircle, "blue"],
    ["In Maintenance", formatNumber(kpis.vehiclesInMaintenance), "shop queue", FiTool, "orange"],
    ["Drivers On Duty", formatNumber(kpis.driversOnDuty), "active shifts", FiActivity, "purple"],
    ["Pending Trips", formatNumber(kpis.pendingTrips), "planned work", FiClock, "orange"],
    ["Fleet Utilization", `${formatNumber(kpis.fleetUtilization)}%`, "on trip vehicles", FiBarChart2, "blue"],
    ["Operational Cost", formatCurrency(kpis.operationalCost), "fuel + maintenance + other", FiDollarSign, "green"],
    ["Fuel Efficiency", `${formatNumber(kpis.fuelEfficiency)} km/L`, "distance per liter", FiActivity, "purple"],
    ["ROI", `${formatNumber(kpis.roi)}%`, "net return", FiBarChart2, "green"],
    ["Fuel Cost", formatCurrency(kpis.fuelCost), "fuel module", FiDollarSign, "orange"],
    ["Maintenance Cost", formatCurrency(kpis.maintenanceCost), "expense module", FiTool, "purple"],
    ["Expense Cost", formatCurrency(kpis.expenseCost), "all expenses", FiDollarSign, "blue"],
    ["Trips Today", formatNumber(kpis.tripsToday), "scheduled today", FiClock, "green"],
    ["Completed Trips", formatNumber(kpis.completedTrips), "closed trips", FiCheckCircle, "blue"],
    ["Cancelled Trips", formatNumber(kpis.cancelledTrips), "cancelled trips", FiXCircle, "orange"]
  ];
}

export function DashboardView({ chartsOnly = false }) {
  const { filters } = useGlobalFilters();
  const [summary, setSummary] = useState({ kpis: {}, charts: {} });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await analyticsApi.summary(filters);
      setSummary(response.data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && !summary.kpis.activeVehicles) {
    return <LoadingState label="Loading dashboard" />;
  }

  return (
    <section className="bi-stack">
      <ErrorState message={error} />
      {!chartsOnly && (
        <div className="kpi-grid">
          {kpiItems(summary.kpis).map(([label, value, caption, Icon, accent]) => (
            <KpiCard key={label} accent={accent} caption={caption} icon={Icon} label={label} value={value} />
          ))}
        </div>
      )}
      <ChartsPanel charts={summary.charts} />
    </section>
  );
}
