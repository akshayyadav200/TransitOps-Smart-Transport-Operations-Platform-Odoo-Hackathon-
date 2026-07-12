# TransitOps Demo Script

## Setup

1. Run `npm install`.
2. Configure MongoDB in `.env`.
3. Run `npm run seed:demo`.
4. Start the backend with `npm run dev:backend`.
5. Start the frontend with `npm run dev:frontend`.
6. Open `http://127.0.0.1:5173`.

## Credentials

- Admin: `admin@transitops.demo`
- Fleet Manager: `fleet@transitops.demo`
- Dispatcher: `dispatcher@transitops.demo`
- Safety Officer: `safety@transitops.demo`
- Financial Analyst: `finance@transitops.demo`

Use `DEMO_USER_PASSWORD`, or the local hackathon default `TransitOpsDemo@123`.

## Walkthrough

1. Sign in as Admin and show the role-aware sidebar.
2. Open Dashboard and explain active vehicles, available vehicles, maintenance count, drivers on duty, pending trips, cost, fuel efficiency, and ROI.
3. Open Fleet and show vehicle search, filters, status badges, driver records, and compliance indicators.
4. Open Dispatch, create a trip with an available vehicle and driver, then dispatch it.
5. Show the automatic status change: trip becomes `Dispatched`, vehicle and driver become `On Trip`.
6. Complete the trip and show vehicle and driver returning to `Available`.
7. Open Maintenance, create a maintenance job, and show the vehicle moving to `In Shop`.
8. Close maintenance and show the vehicle returning to `Available` unless it is retired.
9. Open Fuel and Expenses and show finance records tied to vehicles or trips.
10. Open Reports and export a CSV.
11. Try a forbidden page as a restricted role and show the clean Unauthorized state.

## Rejection Checks

- Expired license drivers cannot dispatch.
- Suspended drivers cannot dispatch.
- Retired, in-shop, and on-trip vehicles cannot dispatch.
- Over-capacity trips are rejected.
- Unauthorized roles receive `403`.
