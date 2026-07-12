# Submission Checklist

## Backend

- [x] Fuel model with vehicle/trip references, liters, cost, fuel type, date, odometer, filled by, and timestamps.
- [x] Expense model with vehicle/trip references, category, amount, description, date, created by, and timestamps.
- [x] Fuel CRUD routes: `POST /api/fuel`, `GET /api/fuel`, `GET /api/fuel/:id`, `PUT /api/fuel/:id`, `DELETE /api/fuel/:id`.
- [x] Expense CRUD routes.
- [x] Analytics endpoint: `GET /api/analytics/summary`.
- [x] Reports endpoints for vehicle, trip, fuel, expense, cost, and ROI.
- [x] Validation for required fields, positive numbers, enums, dates, and ObjectIds.
- [x] Reference guards for vehicles and trips.
- [x] Search, sorting, pagination, and filters.
- [x] Reusable formula utilities for fuel efficiency, operational cost, fleet utilization, and ROI.

## Frontend

- [x] Dashboard KPI cards.
- [x] Fuel module with list, table, add, edit, delete, search, pagination, loading, empty, error, toast, confirmation, vehicle dropdown, trip dropdown, date picker, history, vehicle-wise fuel, and trip-wise fuel.
- [x] Expense module with cards, table, filters, CRUD, search, pagination, loading, delete confirmation, and success messages.
- [x] Analytics charts with Recharts.
- [x] Reports for vehicle, trip, fuel, expense, cost, and ROI.
- [x] CSV export for filtered reports using `react-csv`.
- [x] Global filters for vehicle, trip, driver, region, status, date range, expense category, and fuel type.
- [x] Responsive UI, hover states, transitions, loading states, empty states, error states, toasts, dialogs, and dark mode.

## Verification

- [x] Backend tests pass.
- [x] Frontend tests pass.
- [x] Backend build/syntax check passes.
- [x] Frontend production build passes.
- [x] Lint passes.

## Presentation

- [x] Demo data seed script.
- [x] README updates.
- [x] Architecture diagram.
- [x] Presentation notes.
- [x] Demo script.
- [x] Screenshot capture checklist.
