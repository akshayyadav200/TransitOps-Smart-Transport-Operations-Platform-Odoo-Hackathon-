import React from "react";
import { StatusBadge } from "../../../components/common/StatusBadge.jsx";
import { formatCurrency, formatNumber } from "../formatters.js";

const COLUMNS = [
  ["registrationNumber", "Registration"],
  ["name", "Name"],
  ["type", "Type"],
  ["maximumLoadCapacity", "Capacity"],
  ["odometer", "Odometer"],
  ["region", "Region"],
  ["status", "Status"]
];

export function VehicleTable({ items, loading, onEdit, onRetire, onSort }) {
  if (loading) {
    return <div className="empty-state">Loading vehicles...</div>;
  }

  if (items.length === 0) {
    return <div className="empty-state">No vehicles found.</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {COLUMNS.map(([field, label]) => (
              <th key={field}>
                <button className="sort-button" onClick={() => onSort(`${field},asc`)} type="button">
                  {label}
                </button>
              </th>
            ))}
            <th>Cost</th>
            <th>Dispatch</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((vehicle) => (
            <tr key={vehicle._id}>
              <td>{vehicle.registrationNumber}</td>
              <td>{vehicle.name}</td>
              <td>{vehicle.type}</td>
              <td>{formatNumber(vehicle.maximumLoadCapacity)}</td>
              <td>{formatNumber(vehicle.odometer)}</td>
              <td>{vehicle.region ?? "-"}</td>
              <td>
                <StatusBadge value={vehicle.status} />
              </td>
              <td>{formatCurrency(vehicle.acquisitionCost)}</td>
              <td>{vehicle.dispatchEligible ? "Eligible" : "Blocked"}</td>
              <td className="row-actions">
                <button className="button secondary" onClick={() => onEdit(vehicle)} type="button">
                  Edit
                </button>
                <button className="button danger" disabled={vehicle.status === "Retired"} onClick={() => onRetire(vehicle)} type="button">
                  Retire
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
