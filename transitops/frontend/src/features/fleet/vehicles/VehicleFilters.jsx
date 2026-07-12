import React from "react";
import { VEHICLE_STATUSES, VEHICLE_TYPES } from "../constants.js";

export function VehicleFilters({ filters, onFilter }) {
  return (
    <div className="filters">
      <input
        aria-label="Search vehicles"
        placeholder="Search registration, name, model, region"
        value={filters.search ?? ""}
        onChange={(event) => onFilter("search", event.target.value)}
      />
      <select value={filters.status ?? ""} onChange={(event) => onFilter("status", event.target.value)}>
        <option value="">All statuses</option>
        {VEHICLE_STATUSES.map((status) => (
          <option key={status}>{status}</option>
        ))}
      </select>
      <select value={filters.type ?? ""} onChange={(event) => onFilter("type", event.target.value)}>
        <option value="">All types</option>
        {VEHICLE_TYPES.map((type) => (
          <option key={type}>{type}</option>
        ))}
      </select>
      <input
        aria-label="Vehicle region"
        placeholder="Region"
        value={filters.region ?? ""}
        onChange={(event) => onFilter("region", event.target.value)}
      />
    </div>
  );
}
