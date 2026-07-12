import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { EmptyState } from "./components.jsx";
import { formatCurrency, formatNumber } from "./formatters.js";

const COLORS = ["#266350", "#2f80ed", "#c45432", "#7c3aed", "#f2b84b", "#0f766e", "#b42318"];

function hasData(data) {
  return Array.isArray(data) && data.some((item) => Number(item.count ?? item.cost ?? item.amount ?? item.utilization ?? 0) > 0);
}

function ChartShell({ title, children }) {
  return (
    <article className="chart-card">
      <h2>{title}</h2>
      {children}
    </article>
  );
}

export function ChartsPanel({ charts = {} }) {
  const vehicleStatus = charts.vehicleStatus ?? [];
  const expenseCategories = charts.expenseCategories ?? [];
  const fuelCostOverTime = charts.fuelCostOverTime ?? [];
  const fleetUtilization = charts.fleetUtilization ?? [];
  const tripStatus = charts.tripStatus ?? [];

  return (
    <section className="charts-grid">
      <ChartShell title="Vehicle Status">
        {hasData(vehicleStatus) ? (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={vehicleStatus} dataKey="count" nameKey="status" innerRadius={58} outerRadius={88} paddingAngle={3}>
                {vehicleStatus.map((entry, index) => (
                  <Cell key={entry.status} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatNumber(value)} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState label="No vehicle status data" />
        )}
      </ChartShell>

      <ChartShell title="Expense Categories">
        {hasData(expenseCategories) ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={expenseCategories}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(value) => formatNumber(value)} width={72} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]} fill="#266350" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState label="No expense category data" />
        )}
      </ChartShell>

      <ChartShell title="Fuel Cost Over Time">
        {hasData(fuelCostOverTime) ? (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={fuelCostOverTime}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(value) => formatNumber(value)} width={72} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Line dataKey="cost" stroke="#c45432" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState label="No fuel trend data" />
        )}
      </ChartShell>

      <ChartShell title="Fleet Utilization">
        {hasData(fleetUtilization) ? (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={fleetUtilization}>
              <defs>
                <linearGradient id="utilization" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#2f80ed" stopOpacity={0.34} />
                  <stop offset="95%" stopColor="#2f80ed" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(value) => `${formatNumber(value)}%`} width={72} />
              <Tooltip formatter={(value) => `${formatNumber(value)}%`} />
              <Area dataKey="utilization" stroke="#2f80ed" strokeWidth={3} fill="url(#utilization)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState label="No utilization trend data" />
        )}
      </ChartShell>

      <ChartShell title="Trip Status">
        {hasData(tripStatus) ? (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={tripStatus} dataKey="count" nameKey="status" innerRadius={62} outerRadius={90} paddingAngle={3}>
                {tripStatus.map((entry, index) => (
                  <Cell key={entry.status} fill={COLORS[(index + 2) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatNumber(value)} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState label="No trip status data" />
        )}
      </ChartShell>
    </section>
  );
}
