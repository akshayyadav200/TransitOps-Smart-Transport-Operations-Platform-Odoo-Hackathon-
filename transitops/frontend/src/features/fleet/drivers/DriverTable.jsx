import { StatusBadge } from "../../../components/common/StatusBadge.jsx";
import { formatDate } from "../formatters.js";

const COLUMNS = [
  ["name", "Name"],
  ["licenseNumber", "License"],
  ["licenseCategory", "Category"],
  ["licenseExpiryDate", "Expiry"],
  ["safetyScore", "Safety"],
  ["status", "Status"]
];

export function DriverTable({ canManage = true, items, loading, onEdit, onRemove, onSort }) {
  if (loading) {
    return <div className="empty-state">Loading drivers...</div>;
  }

  if (items.length === 0) {
    return <div className="empty-state">No drivers found.</div>;
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
            <th>Region</th>
            <th>Dispatch</th>
            {canManage ? <th>Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {items.map((driver) => (
            <tr key={driver._id}>
              <td>{driver.name}</td>
              <td>{driver.licenseNumber}</td>
              <td>{driver.licenseCategory}</td>
              <td className={driver.licenseExpired ? "text-danger" : ""}>{formatDate(driver.licenseExpiryDate)}</td>
              <td>{driver.safetyScore}</td>
              <td>
                <StatusBadge value={driver.status} />
              </td>
              <td>{driver.region ?? "-"}</td>
              <td>{driver.dispatchEligible ? "Eligible" : "Blocked"}</td>
              {canManage ? (
                <td className="row-actions">
                  <button className="button secondary" onClick={() => onEdit(driver)} type="button">
                    Edit
                  </button>
                  <button className="button danger" onClick={() => onRemove(driver)} type="button">
                    Delete
                  </button>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
