export const ROLES = Object.freeze({
  ADMIN: "Admin",
  FLEET_MANAGER: "Fleet Manager",
  DISPATCHER: "Dispatcher",
  SAFETY_OFFICER: "Safety Officer",
  FINANCIAL_ANALYST: "Financial Analyst"
});

export const VEHICLE_STATUSES = Object.freeze({
  AVAILABLE: "Available",
  ON_TRIP: "On Trip",
  IN_SHOP: "In Shop",
  RETIRED: "Retired"
});

export const DRIVER_STATUSES = Object.freeze({
  AVAILABLE: "Available",
  ON_TRIP: "On Trip",
  OFF_DUTY: "Off Duty",
  SUSPENDED: "Suspended"
});

export const TRIP_STATUSES = Object.freeze({
  DRAFT: "Draft",
  DISPATCHED: "Dispatched",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled"
});

export const MAINTENANCE_STATUSES = Object.freeze({
  ACTIVE: "Active",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled"
});

export const VEHICLE_TYPES = Object.freeze({
  TRUCK: "Truck",
  VAN: "Van",
  BUS: "Bus",
  TRAILER: "Trailer",
  TANKER: "Tanker",
  OTHER: "Other"
});

export const LICENSE_CATEGORIES = Object.freeze({
  LIGHT: "Light",
  HEAVY: "Heavy",
  COMMERCIAL: "Commercial",
  HAZMAT: "Hazmat",
  PASSENGER: "Passenger"
});

export const EXPENSE_CATEGORIES = Object.freeze({
  FUEL: "Fuel",
  MAINTENANCE: "Maintenance",
  REPAIR: "Repair",
  INSURANCE: "Insurance",
  PARKING: "Parking",
  TOLL: "Toll",
  MISCELLANEOUS: "Miscellaneous"
});

export const FUEL_TYPES = Object.freeze({
  DIESEL: "Diesel",
  PETROL: "Petrol",
  CNG: "CNG",
  ELECTRIC: "Electric",
  HYBRID: "Hybrid",
  OTHER: "Other"
});

export const roleValues = Object.freeze(Object.values(ROLES));
export const vehicleStatusValues = Object.freeze(Object.values(VEHICLE_STATUSES));
export const driverStatusValues = Object.freeze(Object.values(DRIVER_STATUSES));
export const tripStatusValues = Object.freeze(Object.values(TRIP_STATUSES));
export const maintenanceStatusValues = Object.freeze(Object.values(MAINTENANCE_STATUSES));
export const vehicleTypeValues = Object.freeze(Object.values(VEHICLE_TYPES));
export const licenseCategoryValues = Object.freeze(Object.values(LICENSE_CATEGORIES));
export const expenseCategoryValues = Object.freeze(Object.values(EXPENSE_CATEGORIES));
export const fuelTypeValues = Object.freeze(Object.values(FUEL_TYPES));
