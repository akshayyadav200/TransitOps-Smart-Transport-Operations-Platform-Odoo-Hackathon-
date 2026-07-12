# TransitOps

TransitOps is a Smart Transport Operations Platform for a 6-hour hackathon build. The current implementation includes the Person 4 Business Intelligence scope: fuel operations, expenses, dashboards, analytics, charts, reports, CSV export, filters, UI polish, and presentation assets.

## Stack

- Frontend: Vite + React, React Router, Axios, React Hook Form, Recharts, React CSV, React Hot Toast, React Icons, Tailwind-ready CSS
- Backend: Node.js + Express
- Database: MongoDB via Mongoose
- Package manager: npm workspaces

## Person 4 BI Modules

- Fuel Module: MongoDB model, validation, CRUD APIs, service/controller/routes, table, form, search, pagination, vehicle/trip dropdowns, fuel history, vehicle-wise fuel, trip-wise fuel, success/error toasts, and confirmation dialogs.
- Expense Module: MongoDB model, validation, CRUD APIs, service/controller/routes, cards, filters, table, search, pagination, success/error toasts, and delete confirmation.
- Dashboard and Analytics: KPI cards for fleet, driver, trip, cost, fuel, and ROI metrics with reusable formula utilities.
- Charts: Recharts pie, bar, line, area, and donut charts for vehicle status, expense categories, fuel cost trends, fleet utilization, and trip status.
- Reports: Vehicle, Trip, Fuel, Expense, Cost, and ROI reports with search, sorting, pagination, date/vehicle/status/region/category/fuel filters, and CSV export of filtered rows.
- Presentation Assets: Demo data seed script plus architecture, demo, screenshot, and submission documents in `docs/`.

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

## Environment

Copy `.env.example` into environment-specific `.env` files as needed. Do not commit real secrets.

Required variables:

- `PORT`
- `NODE_ENV`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `FRONTEND_URL`

Frontend variables:

- `VITE_API_BASE_URL`

## Commands

Install dependencies:

```bash
npm install
```

Run backend:

```bash
npm run dev:backend
```

Run frontend:

```bash
npm run dev:frontend
```

Seed demo data:

```bash
npm --workspace backend run seed:demo
```

Run quality checks:

```bash
npm run lint
npm run build
npm test
```

## BI API Endpoints

```http
POST   /api/fuel
GET    /api/fuel
GET    /api/fuel/:id
PUT    /api/fuel/:id
DELETE /api/fuel/:id
GET    /api/fuel/history
GET    /api/fuel/vehicle-wise
GET    /api/fuel/trip-wise

POST   /api/expenses
GET    /api/expenses
GET    /api/expenses/:id
PUT    /api/expenses/:id
DELETE /api/expenses/:id
GET    /api/expenses/categories
GET    /api/expenses/vehicle-wise

GET    /api/analytics/summary
GET    /api/reports/vehicles
GET    /api/reports/trips
GET    /api/reports/fuel
GET    /api/reports/expenses
GET    /api/reports/costs
GET    /api/reports/roi
GET    /api/reports/filters
```

## BI Formulas

- Fuel Efficiency = Distance / Fuel Consumed
- Operational Cost = Fuel Cost + Maintenance Cost + Other Expenses
- Fleet Utilization = On Trip Vehicles / Total Vehicles x 100
- ROI = (Revenue - Fuel Cost - Maintenance Cost - Other Expenses) / Vehicle Acquisition Cost x 100

## Presentation Assets

- Architecture: `docs/architecture-diagram.md`
- Demo script: `docs/demo-script.md`
- Presentation notes: `docs/presentation-notes.md`
- Screenshots checklist: `docs/screenshots.md`
- Submission checklist: `docs/submission-checklist.md`

## API Health Check

```http
GET /api/health
```

Response shape:

```json
{
  "success": true,
  "message": "Service is healthy",
  "data": {
    "service": "TransitOps API",
    "environment": "development",
    "database": {
      "state": "connected"
    },
    "timestamp": "2026-07-12T00:00:00.000Z"
  }
}
```
