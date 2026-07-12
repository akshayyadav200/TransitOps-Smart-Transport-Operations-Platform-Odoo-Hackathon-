const indianCurrencyFormatter = new Intl.NumberFormat("en-IN", {
  currency: "INR",
  maximumFractionDigits: 0,
  style: "currency"
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric"
});

export function safeValue(value, fallback = "N/A") {
  return value === null || value === undefined || value === "" ? fallback : value;
}

export function formatIndianCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "N/A";
  }

  return indianCurrencyFormatter.format(Number(value));
}

export function formatDate(value) {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return dateFormatter.format(date);
}

export function formatLiters(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "N/A";
  }

  return `${Number(value).toLocaleString("en-IN")} L`;
}

export function formatKilometers(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "N/A";
  }

  return `${Number(value).toLocaleString("en-IN")} km`;
}

export function formatPercentage(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "N/A";
  }

  return `${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 1 })}%`;
}
