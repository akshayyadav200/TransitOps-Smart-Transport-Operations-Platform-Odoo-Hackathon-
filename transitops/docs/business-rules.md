# Business Rules

## Access Roles

- Admin: full platform administration.
- Fleet Manager: vehicle, driver, and maintenance operations.
- Dispatcher: trip planning and dispatch coordination.
- Safety Officer: driver compliance and safety oversight.
- Financial Analyst: revenue, fuel, maintenance, and expense review.

## Foundation Rules

- All API responses follow the shared success/error convention.
- Backend routes live under `/api`.
- Health checks must never expose credentials or secret configuration.
- User email addresses are stored lowercase and trimmed.
- User email addresses must be unique.
- Production error responses must not include stack traces.

## Domain Status Rules

- Vehicle statuses: Available, On Trip, In Shop, Retired.
- Driver statuses: Available, On Trip, Off Duty, Suspended.
- Trip statuses: Draft, Dispatched, Completed, Cancelled.
- Maintenance statuses: Active, Completed, Cancelled.

## Business Intelligence Rules

- Fuel records must belong to a valid vehicle.
- Fuel records may belong to a valid trip.
- Fuel liters and fuel cost must be greater than zero.
- Fuel odometer cannot be negative.
- Expenses must belong to a valid vehicle.
- Expenses may belong to a valid trip.
- Expense amount must be greater than zero.
- Expense categories: Fuel, Maintenance, Repair, Insurance, Parking, Toll, Miscellaneous.
- Fuel types: Diesel, Petrol, CNG, Electric, Hybrid, Other.
- Operational Cost = Fuel Cost + Maintenance Cost + Other Expenses.
- Fuel Efficiency = Distance / Fuel Consumed.
- Fleet Utilization = On Trip Vehicles / Total Vehicles x 100.
- ROI = (Revenue - Fuel Cost - Maintenance Cost - Other Expenses) / Vehicle Acquisition Cost x 100.
