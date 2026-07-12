export const FUEL_TYPES = ["Diesel", "Petrol", "CNG", "Electric", "Hybrid", "Other"];

export const EXPENSE_CATEGORIES = [
  "Fuel",
  "Maintenance",
  "Repair",
  "Insurance",
  "Parking",
  "Toll",
  "Miscellaneous"
];

export const TRIP_STATUSES = ["Draft", "Dispatched", "Completed", "Cancelled"];
export const VEHICLE_STATUSES = ["Available", "On Trip", "In Shop", "Retired"];

export const DEFAULT_FILTERS = {
  vehicleId: "",
  tripId: "",
  driverId: "",
  region: "",
  status: "",
  startDate: "",
  endDate: "",
  category: "",
  fuelType: ""
};

export const REPORT_TYPES = [
  { key: "vehicles", label: "Vehicle Report" },
  { key: "trips", label: "Trip Report" },
  { key: "fuel", label: "Fuel Report" },
  { key: "expenses", label: "Expense Report" },
  { key: "costs", label: "Cost Report" },
  { key: "roi", label: "ROI Report" }
];

export const DEFAULT_PAGE_SIZE = 10;
