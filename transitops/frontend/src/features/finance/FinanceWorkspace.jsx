import React, { useEffect, useMemo, useState } from "react";
import { BarChart3, Download, Fuel, IndianRupee, PieChart, RefreshCw, TrendingUp } from "lucide-react";
import { EmptyState, ErrorState, FormError, LoadingSkeleton, PageHeader, StatusBadge } from "../../components/shared.jsx";
import { formatIndianCurrency, formatLiters, formatPercentage, safeValue } from "../../lib/formatters.js";
import { financeApi } from "./financeApi.js";

const expenseCategories = ["Fuel", "Maintenance", "Toll", "Insurance", "Permit", "Other"];

const emptyFuel = {
  vehicle: "",
  trip: "",
  liters: "",
  cost: "",
  odometer: "",
  vendor: "",
  region: "",
  filledAt: ""
};

const emptyExpense = {
  category: "Other",
  amount: "",
  description: "",
  vehicle: "",
  trip: "",
  region: "",
  expenseDate: ""
};

function getId(record) {
  return record?.id ?? record?._id;
}

function dateInput(value) {
  if (!value) {
    return "";
  }
  return new Date(value).toISOString().slice(0, 10);
}

function numberOrZero(value) {
  return value === "" || value === null || value === undefined ? 0 : Number(value);
}

function message(error) {
  return error?.message ?? "Request failed";
}

export function FinanceWorkspace({ mode }) {
  const [dashboard, setDashboard] = useState(null);
  const [reports, setReports] = useState(null);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState({ type: "cost", startDate: "", endDate: "", region: "", status: "" });
  const [fuelForm, setFuelForm] = useState(emptyFuel);
  const [expenseForm, setExpenseForm] = useState(emptyExpense);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const titleByMode = {
    dashboard: "Dashboard",
    analytics: "Analytics",
    reports: "Reports",
    fuel: "Fuel",
    expenses: "Expenses"
  };

  async function loadData() {
    setError(null);
    setLoading(true);

    try {
      const [dashboardPayload, reportsPayload, fuelPayload, expensePayload] = await Promise.all([
        financeApi.dashboard(filters),
        financeApi.reports(filters),
        financeApi.fuel.list(filters),
        financeApi.expenses.list(filters)
      ]);
      setDashboard(dashboardPayload.data.dashboard);
      setReports(reportsPayload.data.reports);
      setFuelLogs(fuelPayload.data.fuelLogs ?? []);
      setExpenses(expensePayload.data.expenses ?? []);
    } catch (loadError) {
      setError(loadError);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  async function saveFuel(event) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await financeApi.fuel.create({
        ...fuelForm,
        liters: numberOrZero(fuelForm.liters),
        cost: numberOrZero(fuelForm.cost),
        odometer: numberOrZero(fuelForm.odometer)
      });
      setFuelForm(emptyFuel);
      await loadData();
    } catch (saveError) {
      setError(saveError);
    } finally {
      setSaving(false);
    }
  }

  async function saveExpense(event) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await financeApi.expenses.create({
        ...expenseForm,
        amount: numberOrZero(expenseForm.amount)
      });
      setExpenseForm(emptyExpense);
      await loadData();
    } catch (saveError) {
      setError(saveError);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="finance-workspace">
        <PageHeader eyebrow="Business intelligence" title={titleByMode[mode]} description="Loading finance and operational intelligence." />
        <LoadingSkeleton rows={6} />
      </section>
    );
  }

  if (error && !dashboard) {
    return <ErrorState title="Finance data unavailable" message={message(error)} onRetry={loadData} />;
  }

  return (
    <section className="finance-workspace">
      <PageHeader
        eyebrow="Business intelligence"
        title={titleByMode[mode]}
        description="Dashboards, finance controls, analytics reports, and export-ready evidence for the demo."
        actions={
          <button className="toolbar-button" onClick={loadData} type="button">
            <RefreshCw size={16} aria-hidden="true" />
            <span>Refresh</span>
          </button>
        }
      />

      <FinanceFilters filters={filters} onChange={updateFilter} onApply={loadData} />
      <FormError message={error ? message(error) : null} errors={error?.errors} />

      {(mode === "dashboard" || mode === "analytics") && <DashboardPanel dashboard={dashboard} />}
      {mode === "fuel" && (
        <FuelPanel fuelForm={fuelForm} fuelLogs={fuelLogs} onChange={setFuelForm} onSubmit={saveFuel} saving={saving} />
      )}
      {mode === "expenses" && (
        <ExpensePanel expenseForm={expenseForm} expenses={expenses} onChange={setExpenseForm} onSubmit={saveExpense} saving={saving} />
      )}
      {mode === "reports" && <ReportsPanel filters={filters} reports={reports} />}
    </section>
  );
}

function FinanceFilters({ filters, onApply, onChange }) {
  return (
    <section className="finance-filters">
      <label>
        Start
        <input type="date" value={filters.startDate} onChange={(event) => onChange("startDate", event.target.value)} />
      </label>
      <label>
        End
        <input type="date" value={filters.endDate} onChange={(event) => onChange("endDate", event.target.value)} />
      </label>
      <label>
        Region
        <input value={filters.region} onChange={(event) => onChange("region", event.target.value)} />
      </label>
      <label>
        Status
        <input value={filters.status} onChange={(event) => onChange("status", event.target.value)} />
      </label>
      <button className="button primary" onClick={onApply} type="button">
        Apply
      </button>
    </section>
  );
}

function DashboardPanel({ dashboard }) {
  const cards = dashboard?.cards ?? {};
  const cardConfig = [
    ["Active Vehicles", cards.activeVehicles, BarChart3],
    ["Available Vehicles", cards.availableVehicles, PieChart],
    ["In Maintenance", cards.vehiclesInMaintenance, PieChart],
    ["Drivers On Duty", cards.driversOnDuty, BarChart3],
    ["Pending Trips", cards.pendingTrips, BarChart3],
    ["Fleet Utilization", formatPercentage(cards.fleetUtilization), TrendingUp],
    ["Operational Cost", formatIndianCurrency(cards.operationalCost), IndianRupee],
    ["Fuel Efficiency", `${cards.fuelEfficiency ?? 0} L/km`, Fuel],
    ["ROI", formatPercentage(cards.roi), TrendingUp]
  ];

  return (
    <>
      <div className="finance-card-grid">
        {cardConfig.map(([label, value, CardIcon]) => (
          <article className="finance-card" key={label}>
            {React.createElement(CardIcon, { size: 22, "aria-hidden": "true" })}
            <span>{label}</span>
            <strong>{value ?? 0}</strong>
          </article>
        ))}
      </div>
      <ChartGrid charts={dashboard?.charts ?? {}} />
    </>
  );
}

function ChartGrid({ charts }) {
  const chartEntries = [
    ["Vehicle Status", charts.vehicleStatus],
    ["Trip Status", charts.tripStatus],
    ["Expense Analysis", charts.expenseAnalysis],
    ["Fuel Analysis", charts.fuelAnalysis],
    ["Fleet Utilization", charts.fleetUtilization]
  ];

  return (
    <div className="chart-grid">
      {chartEntries.map(([title, data]) => (
        <section className="chart-panel" key={title}>
          <h2>{title}</h2>
          {(data ?? []).length === 0 ? (
            <EmptyState title="No chart data" message="Add demo data or adjust filters." />
          ) : (
            <div className="bar-list">
              {data.map((item) => (
                <div className="bar-row" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{Number(item.value ?? 0).toLocaleString("en-IN")}</strong>
                  <div style={{ width: `${Math.min(Number(item.value ?? 0), 100)}%` }} />
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

function FuelPanel({ fuelForm, fuelLogs, onChange, onSubmit, saving }) {
  return (
    <div className="finance-grid">
      <form className="panel" onSubmit={onSubmit}>
        <h2>Add Fuel Log</h2>
        <FinanceFormFields form={fuelForm} onChange={onChange} type="fuel" />
        <button className="button primary" disabled={saving} type="submit">
          Save Fuel
        </button>
      </form>
      <FinanceTable rows={fuelLogs} type="fuel" />
    </div>
  );
}

function ExpensePanel({ expenseForm, expenses, onChange, onSubmit, saving }) {
  return (
    <div className="finance-grid">
      <form className="panel" onSubmit={onSubmit}>
        <h2>Add Expense</h2>
        <FinanceFormFields form={expenseForm} onChange={onChange} type="expense" />
        <button className="button primary" disabled={saving} type="submit">
          Save Expense
        </button>
      </form>
      <FinanceTable rows={expenses} type="expense" />
    </div>
  );
}

function FinanceFormFields({ form, onChange, type }) {
  function update(field, value) {
    onChange({ ...form, [field]: value });
  }

  if (type === "fuel") {
    return (
      <div className="form-grid">
        <label>Vehicle ID<input required value={form.vehicle} onChange={(event) => update("vehicle", event.target.value)} /></label>
        <label>Trip ID<input value={form.trip} onChange={(event) => update("trip", event.target.value)} /></label>
        <label>Liters<input min="0" required type="number" value={form.liters} onChange={(event) => update("liters", event.target.value)} /></label>
        <label>Cost<input min="0" required type="number" value={form.cost} onChange={(event) => update("cost", event.target.value)} /></label>
        <label>Odometer<input min="0" type="number" value={form.odometer} onChange={(event) => update("odometer", event.target.value)} /></label>
        <label>Filled At<input type="date" value={dateInput(form.filledAt)} onChange={(event) => update("filledAt", event.target.value)} /></label>
        <label>Vendor<input value={form.vendor} onChange={(event) => update("vendor", event.target.value)} /></label>
        <label>Region<input value={form.region} onChange={(event) => update("region", event.target.value)} /></label>
      </div>
    );
  }

  return (
    <div className="form-grid">
      <label>Category<select value={form.category} onChange={(event) => update("category", event.target.value)}>
        {expenseCategories.map((category) => <option key={category}>{category}</option>)}
      </select></label>
      <label>Amount<input min="0" required type="number" value={form.amount} onChange={(event) => update("amount", event.target.value)} /></label>
      <label>Description<input required value={form.description} onChange={(event) => update("description", event.target.value)} /></label>
      <label>Vehicle ID<input value={form.vehicle} onChange={(event) => update("vehicle", event.target.value)} /></label>
      <label>Trip ID<input value={form.trip} onChange={(event) => update("trip", event.target.value)} /></label>
      <label>Date<input type="date" value={dateInput(form.expenseDate)} onChange={(event) => update("expenseDate", event.target.value)} /></label>
      <label>Region<input value={form.region} onChange={(event) => update("region", event.target.value)} /></label>
    </div>
  );
}

function FinanceTable({ rows, type }) {
  if (rows.length === 0) {
    return <EmptyState title={`No ${type} records`} message="Create a record or seed demo data for the presentation." />;
  }

  return (
    <section className="panel">
      <h2>{type === "fuel" ? "Fuel History" : "Expense History"}</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Trip</th>
              <th>{type === "fuel" ? "Liters" : "Category"}</th>
              <th>{type === "fuel" ? "Cost" : "Amount"}</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={getId(row)}>
                <td>{safeValue(row.vehicle?.registrationNumber)}</td>
                <td>{safeValue(row.trip?.tripNumber)}</td>
                <td>{type === "fuel" ? formatLiters(row.liters) : row.category}</td>
                <td>{formatIndianCurrency(type === "fuel" ? row.cost : row.amount)}</td>
                <td>{new Date(type === "fuel" ? row.filledAt : row.expenseDate).toLocaleDateString("en-IN")}</td>
                <td><StatusBadge value={row.trip?.status ?? "Active"} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ReportsPanel({ filters, reports }) {
  const summary = useMemo(() => {
    const vehicleCount = reports?.vehicleReport?.length ?? 0;
    const tripCount = reports?.tripReport?.length ?? 0;
    const fuelCost = reports?.fuelReport?.reduce((sum, row) => sum + Number(row.cost ?? 0), 0) ?? 0;
    const expenseCost = reports?.costReport?.reduce((sum, row) => sum + Number(row.amount ?? 0), 0) ?? 0;
    return { vehicleCount, tripCount, fuelCost, expenseCost };
  }, [reports]);

  return (
    <section className="reports-panel">
      <div className="finance-card-grid">
        <article className="finance-card"><span>Vehicle Report</span><strong>{summary.vehicleCount}</strong></article>
        <article className="finance-card"><span>Trip Report</span><strong>{summary.tripCount}</strong></article>
        <article className="finance-card"><span>Fuel Report</span><strong>{formatIndianCurrency(summary.fuelCost)}</strong></article>
        <article className="finance-card"><span>Cost Report</span><strong>{formatIndianCurrency(summary.expenseCost)}</strong></article>
        <article className="finance-card"><span>ROI</span><strong>{formatPercentage(reports?.roiReport?.cards?.roi ?? 0)}</strong></article>
      </div>
      <div className="export-grid">
        {["vehicle", "trip", "cost", "fuel", "roi"].map((type) => (
          <a className="button primary" href={financeApi.reportExportUrl({ ...filters, type })} key={type} rel="noreferrer" target="_blank">
            <Download size={16} aria-hidden="true" />
            {type.toUpperCase()} CSV
          </a>
        ))}
      </div>
    </section>
  );
}
