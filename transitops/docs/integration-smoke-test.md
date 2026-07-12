# Integration Smoke Test

Use this checklist before merging feature branches into `develop`.

## Auth

- Start backend and frontend.
- Open `http://localhost:5173` or `http://127.0.0.1:5173`.
- Login with a seeded demo user.
- Refresh the browser and confirm `/api/auth/me` restores the session.
- Logout and confirm the login page appears.

## Sidebar

- Confirm the sidebar shows the current user role.
- Confirm mobile width shows the menu button and sidebar overlay.
- Confirm every visible navigation item opens a page without a broken link.

## Role Visibility

- Admin sees all core modules.
- Fleet Manager sees dashboard, vehicles, maintenance, reports.
- Dispatcher sees trips and dispatch-related access.
- Safety Officer sees driver compliance access.
- Financial Analyst sees fuel, expenses, analytics, reports, and dashboard where enabled.

## Route Accessibility

- Unauthenticated access to protected pages redirects to `/login`.
- Authenticated users without permission see the Unauthorized state.
- Unknown frontend routes show the Not Found state.

## API Handling

- `GET /api/health` returns `success: true`.
- 401 responses clear invalid frontend session state.
- 403 responses show a clear forbidden message or Unauthorized page.
- Validation errors show readable field messages.
- Network failures show a retry-capable error state.

## Module Loading

- Register backend module routes only when the route file exists.
- Do not add placeholder APIs for vehicles, drivers, trips, maintenance, fuel logs, expenses, dashboard, or reports.
- If a module page is not implemented yet, the shell may show an integration-ready empty state.

## Field Contracts

- Vehicle: `registrationNumber`, `name`, `model`, `type`, `maximumLoadCapacity`, `odometer`, `acquisitionCost`, `region`, `status`.
- Driver: `name`, `licenseNumber`, `licenseCategory`, `licenseExpiryDate`, `contactNumber`, `safetyScore`, `region`, `status`.
- Trip: `tripNumber`, `source`, `destination`, `vehicle`, `driver`, `cargoWeight`, `plannedDistance`, `startingOdometer`, `finalOdometer`, `actualDistance`, `fuelConsumed`, `revenue`, `region`, `status`.
- Maintenance: `vehicle`, `serviceType`, `description`, `cost`, `status`, `startDate`, `endDate`.
