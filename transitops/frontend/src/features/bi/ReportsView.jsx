import { useCallback, useMemo, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { FiDownload, FiSearch } from "react-icons/fi";
import { Pagination } from "../../components/common/Pagination.jsx";
import { REPORT_TYPES } from "./constants.js";
import { reportApi } from "./biApi.js";
import { EmptyState, ErrorState, LoadingState } from "./components.jsx";
import { useGlobalFilters } from "./FiltersContext.jsx";
import { formatCurrency, formatDate, formatNumber, tripLabel, vehicleLabel } from "./formatters.js";
import { usePagedResource } from "./usePagedResource.js";

const REPORT_COLUMNS = {
  vehicles: [
    ["registrationNumber", "Registration"],
    ["name", "Name"],
    ["type", "Type"],
    ["region", "Region"],
    ["status", "Status"],
    ["acquisitionCost", "Acquisition Cost"]
  ],
  trips: [
    ["tripCode", "Trip"],
    ["vehicleId", "Vehicle"],
    ["driverId", "Driver"],
    ["origin", "Origin"],
    ["destination", "Destination"],
    ["region", "Region"],
    ["status", "Status"],
    ["scheduledStart", "Date"],
    ["distanceKm", "Distance"],
    ["revenue", "Revenue"]
  ],
  fuel: [
    ["date", "Date"],
    ["vehicleId", "Vehicle"],
    ["tripId", "Trip"],
    ["fuelType", "Fuel"],
    ["liters", "Liters"],
    ["cost", "Cost"],
    ["odometer", "Odometer"],
    ["filledBy", "Filled By"]
  ],
  expenses: [
    ["date", "Date"],
    ["vehicleId", "Vehicle"],
    ["tripId", "Trip"],
    ["category", "Category"],
    ["amount", "Amount"],
    ["description", "Description"],
    ["createdBy", "Created By"]
  ],
  costs: [
    ["registrationNumber", "Registration"],
    ["name", "Vehicle"],
    ["region", "Region"],
    ["fuelCost", "Fuel Cost"],
    ["maintenanceCost", "Maintenance Cost"],
    ["expenseCost", "Expense Cost"],
    ["operationalCost", "Operational Cost"],
    ["fuelEfficiency", "Fuel Efficiency"]
  ],
  roi: [
    ["registrationNumber", "Registration"],
    ["name", "Vehicle"],
    ["region", "Region"],
    ["revenue", "Revenue"],
    ["operationalCost", "Operational Cost"],
    ["acquisitionCost", "Acquisition Cost"],
    ["roi", "ROI %"]
  ]
};

function cellValue(row, field) {
  if (field === "vehicleId") {
    return vehicleLabel(row.vehicleId);
  }

  if (field === "tripId") {
    return tripLabel(row.tripId);
  }

  if (field === "driverId") {
    return row.driverId?.name ?? "-";
  }

  if (["date", "scheduledStart", "createdAt"].includes(field)) {
    return formatDate(row[field]);
  }

  if (["cost", "amount", "fuelCost", "maintenanceCost", "expenseCost", "operationalCost", "revenue", "acquisitionCost"].includes(field)) {
    return formatCurrency(row[field]);
  }

  if (["liters", "odometer", "distanceKm", "fuelEfficiency", "roi"].includes(field)) {
    return formatNumber(row[field]);
  }

  return row[field] ?? "-";
}

function toCsvRows(rows, columns) {
  return rows.map((row) => Object.fromEntries(columns.map(([field, label]) => [label, cellValue(row, field)])));
}

function ReportTable({ type, items, loading, onSort }) {
  const columns = REPORT_COLUMNS[type];

  if (loading) {
    return <LoadingState label="Loading report" />;
  }

  if (items.length === 0) {
    return <EmptyState label="No report rows found" />;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map(([field, label]) => (
              <th key={field}>
                <button className="sort-button" onClick={() => onSort(field)} type="button">
                  {label}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              {columns.map(([field]) => (
                <td key={field}>{cellValue(item, field)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ReportsView() {
  const { filters } = useGlobalFilters();
  const [type, setType] = useState("vehicles");
  const [exportRows, setExportRows] = useState([]);
  const csvRef = useRef(null);
  const fetchReport = useCallback((params) => reportApi.report(type, params), [type]);
  const resource = usePagedResource(fetchReport, filters, { sort: "-createdAt" });
  const columns = REPORT_COLUMNS[type];
  const csvData = useMemo(() => toCsvRows(exportRows.length ? exportRows : resource.items, columns), [columns, exportRows, resource.items]);

  async function exportFilteredReport() {
    const response = await reportApi.report(type, { ...filters, ...resource.filters, page: 1, limit: 100 });
    setExportRows(response.data.items ?? []);
    window.setTimeout(() => csvRef.current?.link?.click(), 0);
  }

  function changeType(nextType) {
    setType(nextType);
    setExportRows([]);
  }

  return (
    <section className="panel report-panel">
      <div className="panel-heading report-toolbar">
        <div>
          <p className="eyebrow">Reports</p>
          <h2>{REPORT_TYPES.find((report) => report.key === type)?.label}</h2>
        </div>
        <div className="report-actions">
          <select value={type} onChange={(event) => changeType(event.target.value)}>
            {REPORT_TYPES.map((report) => (
              <option key={report.key} value={report.key}>
                {report.label}
              </option>
            ))}
          </select>
          <label className="search-field">
            <FiSearch aria-hidden="true" />
            <input
              placeholder="Search report"
              value={resource.filters.search ?? ""}
              onChange={(event) => resource.updateFilter("search", event.target.value)}
            />
          </label>
          <button className="button primary icon-label" onClick={exportFilteredReport} type="button">
            <FiDownload aria-hidden="true" />
            Export CSV
          </button>
          <CSVLink
            className="hidden-export"
            data={csvData}
            filename={`transitops-${type}-report.csv`}
            ref={csvRef}
            target="_blank"
          />
        </div>
      </div>
      <ErrorState message={resource.error} />
      <ReportTable items={resource.items} loading={resource.loading} onSort={resource.setSort} type={type} />
      <Pagination pagination={resource.pagination} onPageChange={resource.setPage} />
    </section>
  );
}
