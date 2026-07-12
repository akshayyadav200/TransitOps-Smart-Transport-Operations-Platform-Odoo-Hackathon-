import { DRIVER_STATUSES, LICENSE_CATEGORIES } from "../constants.js";

export function DriverFilters({ filters, onFilter }) {
  return (
    <div className="filters">
      <input
        aria-label="Search drivers"
        placeholder="Search name, license, phone, region"
        value={filters.search ?? ""}
        onChange={(event) => onFilter("search", event.target.value)}
      />
      <select value={filters.status ?? ""} onChange={(event) => onFilter("status", event.target.value)}>
        <option value="">All statuses</option>
        {DRIVER_STATUSES.map((status) => (
          <option key={status}>{status}</option>
        ))}
      </select>
      <select value={filters.licenseCategory ?? ""} onChange={(event) => onFilter("licenseCategory", event.target.value)}>
        <option value="">All categories</option>
        {LICENSE_CATEGORIES.map((category) => (
          <option key={category}>{category}</option>
        ))}
      </select>
      <select value={filters.licenseValidity ?? ""} onChange={(event) => onFilter("licenseValidity", event.target.value)}>
        <option value="">All licenses</option>
        <option value="valid">Valid</option>
        <option value="expired">Expired</option>
        <option value="expiringSoon">Expiring soon</option>
      </select>
    </div>
  );
}

