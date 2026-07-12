export function compactParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );
}

export function fieldErrors(error) {
  return Object.fromEntries((error?.errors ?? []).map((item) => [item.field, item.message]));
}

export function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function formatNumber(value, options = {}) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: options.maximumFractionDigits ?? 2
  }).format(Number(value ?? 0));
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value ?? 0));
}

export function vehicleLabel(vehicle) {
  if (!vehicle) {
    return "-";
  }

  return `${vehicle.registrationNumber ?? "Vehicle"} · ${vehicle.name ?? "Unnamed"}`;
}

export function tripLabel(trip) {
  if (!trip) {
    return "-";
  }

  return `${trip.tripCode ?? "Trip"} · ${trip.origin ?? "-"} to ${trip.destination ?? "-"}`;
}

export function normalizeId(value) {
  if (!value) {
    return "";
  }

  if (typeof value === "object") {
    return value._id ?? value.id ?? "";
  }

  return value;
}

export function asDateInput(value) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 10);
}
