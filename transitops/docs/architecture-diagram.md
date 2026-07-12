# TransitOps Architecture Diagram

```mermaid
flowchart LR
  User["Admin / Fleet / Dispatcher / Safety / Finance User"] --> UI["React Protected App Shell"]
  UI --> AuthUI["Auth Context + Route Guards"]
  UI --> FleetUI["Fleet & Driver Workspace"]
  UI --> OpsUI["Dispatch & Maintenance Workspace"]
  UI --> FinanceUI["Dashboard, Fuel, Expenses, Reports"]

  AuthUI --> API["Express API /api"]
  FleetUI --> API
  OpsUI --> API
  FinanceUI --> API

  API --> Security["Helmet, CORS, Rate Limits, JWT Auth, RBAC"]
  API --> Routes["Route Modules"]
  Routes --> Controllers["Controllers"]
  Controllers --> Services["Business Services"]
  Services --> Validators["Input Validation"]
  Services --> Repositories["Fleet Query Helpers"]
  Services --> Mongo["MongoDB via Mongoose"]

  Mongo --> User["User"]
  Mongo --> Vehicle["Vehicle"]
  Mongo --> Driver["Driver"]
  Mongo --> Trip["Trip"]
  Mongo --> Maintenance["Maintenance"]
  Mongo --> Fuel["FuelLog"]
  Mongo --> Expense["Expense"]
```

## Working Modules

- Auth and RBAC: login, current user, logout, protected routing, role-aware navigation.
- Fleet: vehicle CRUD, driver CRUD, compliance dashboard, available vehicle and driver APIs.
- Operations: trip CRUD, dispatch, completion, cancellation, maintenance open/close, automatic status changes.
- Finance: dashboard metrics, fuel logs, expenses, reports, and CSV export.

## Safe Integration Note

The working app lives under `transitops/`. Some remote prototype branches contain a second root-level scaffold and are not merged directly because they would delete working modules from this app.
