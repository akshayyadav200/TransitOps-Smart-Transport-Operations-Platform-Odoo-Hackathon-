# TransitOps

TransitOps is a Smart Transport Operations Platform built for a 6-hour hackathon. It gives transport teams one secure workspace for fleet readiness, driver compliance, dispatch automation, maintenance, finance visibility, analytics, and exportable reports.

## Problem

Transport operators often manage vehicles, drivers, trips, maintenance, fuel, and expenses in separate spreadsheets. That makes dispatch decisions slower, hides compliance risk, and delays cost and ROI visibility.

## Solution

TransitOps centralizes the operational workflow:

- Authenticate users with role-based access control.
- Manage vehicles, drivers, and compliance signals.
- Create, dispatch, complete, and cancel trips with automatic status changes.
- Open and close maintenance jobs while protecting unavailable vehicles from dispatch.
- Track fuel and expenses.
- View dashboard KPIs, analytics summaries, reports, and CSV exports.

## Mandatory Features

- Secure auth: login, current user, logout, HttpOnly JWT cookie, seeded demo users.
- RBAC: Admin, Fleet Manager, Dispatcher, Safety Officer, Financial Analyst.
- Fleet: vehicle CRUD, driver CRUD, validation, search, filters, status badges, availability APIs.
- Operations: trip CRUD, dispatch rules, maintenance CRUD, automatic status restoration.
- Finance: fuel logs, expenses, dashboard metrics, reports, CSV export.
- Security: Helmet, CORS allowlist, login rate limit, body limits, safe errors, no password hashes in responses.
- Demo data: deterministic users, vehicles, drivers, trips, maintenance, fuel, and expense records.

## User Roles

- Admin: full platform access.
- Fleet Manager: vehicles, drivers, maintenance, compliance, dashboard, reports.
- Dispatcher: trip creation and dispatch operations.
- Safety Officer: driver and compliance review.
- Financial Analyst: dashboard, analytics, fuel, expenses, and reports.

## Technology Stack

- Frontend: Vite + React
- Backend: Node.js + Express
- Database: MongoDB with Mongoose
- Auth: bcrypt password hashing and signed JWT session cookie
- Package manager: npm workspaces

## Architecture Overview

```text
React protected app shell
  -> Auth context and role-aware navigation
  -> Fleet, Operations, Finance workspaces
  -> Shared API client with credentials

Express API under /api
  -> Security middleware
  -> Auth and RBAC middleware
  -> Route modules
  -> Controllers
  -> Services and validators
  -> Mongoose models
  -> MongoDB
```

More detail: `docs/architecture-diagram.md`.

## Project Structure

```text
transitops/
  backend/
  frontend/
  docs/
  README.md
  .gitignore
  .env.example
```

## Environment Variables

Copy `.env.example` into environment-specific `.env` files. Do not commit real secrets.

Backend variables:

- `PORT`
- `NODE_ENV`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `AUTH_COOKIE_NAME`
- `FRONTEND_URL`
- `DEMO_USER_PASSWORD`
- `DNS_RESOLVERS` optional, only for hosting DNS issues

Frontend variable:

- `VITE_API_BASE_URL`

## Database Setup

Use MongoDB locally or MongoDB Atlas. Set `DATABASE_URL` to the connection string in your local `.env`. The application validates required production variables and the seed command fails fast if the database cannot connect.

## Commands

Install dependencies:

```bash
npm install
```

Seed demo data:

```bash
npm run seed:demo
```

Run backend:

```bash
npm run dev:backend
```

Run frontend:

```bash
npm run dev:frontend
```

Run quality checks:

```bash
npm run lint
npm test
npm run build
npm audit --omit=dev
```

Production-style commands:

```bash
npm run start:backend
npm run preview:frontend
```

## Demo Accounts

Use `DEMO_USER_PASSWORD`, or the local hackathon default `TransitOpsDemo@123`.

- `admin@transitops.demo` - Admin
- `fleet@transitops.demo` - Fleet Manager
- `dispatcher@transitops.demo` - Dispatcher
- `safety@transitops.demo` - Safety Officer
- `finance@transitops.demo` - Financial Analyst

## Demo Workflow

1. Log in as Admin.
2. Open Fleet and confirm `Van-05` has 500 kg capacity.
3. Confirm Alex has a valid licence.
4. Create a 450 kg trip.
5. Dispatch it and show trip, vehicle, and driver status updates.
6. Complete it and show vehicle and driver restored to Available.
7. Open maintenance and move a vehicle to In Shop.
8. Confirm that vehicle disappears from dispatch options.
9. Close maintenance and show restoration to Available unless retired.
10. Open dashboard and reports, then export CSV.
11. Try a 650 kg cargo trip on `Van-05` and show rejection.

Full script: `docs/demo-flow.md`.

## Analytics Formulas

- Operational cost = fuel cost + maintenance cost + expenses.
- Fuel efficiency = total fuel liters divided by total non-cancelled trip distance.
- Fleet utilization = on-trip vehicles divided by total active vehicles.
- ROI = `(revenue - operational cost) / operational cost` in the current dashboard service.

## Deployment

Deployment placeholders:

- Frontend URL: `https://transitops-frontend.example.com`
- Backend URL: `https://transitops-api.example.com`

Deployment notes and required platform settings are in `docs/deployment.md`.

## Known Limitations

- The app is hackathon-scoped and does not include document uploads, email reminders, PDF export, or a native mobile app.
- CSV export is implemented for reports; PDF export is intentionally out of scope.
- External deployment URLs must be filled in by the hosting platform before submission.
- Demo credentials are for local/demo use only and must not be reused as production secrets.

## Team Responsibilities

- Person 1: architecture, auth, RBAC, security, integration, release readiness.
- Person 2: fleet, driver, compliance, availability APIs.
- Person 3: trips, dispatch engine, maintenance, status automation.
- Person 4: finance, analytics, reports, CSV export, presentation support.

## API Health Check

```http
GET /api/health
```

Expected response includes service name, environment, database state, and timestamp.
