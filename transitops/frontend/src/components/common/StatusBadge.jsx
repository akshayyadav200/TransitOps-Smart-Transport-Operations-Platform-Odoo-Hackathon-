const STATUS_STYLES = {
  Available: "badge badge-success",
  "On Trip": "badge badge-info",
  "In Shop": "badge badge-warning",
  Retired: "badge badge-muted",
  "Off Duty": "badge badge-muted",
  Suspended: "badge badge-danger"
};

export function StatusBadge({ value }) {
  return <span className={STATUS_STYLES[value] ?? "badge badge-muted"}>{value}</span>;
}

