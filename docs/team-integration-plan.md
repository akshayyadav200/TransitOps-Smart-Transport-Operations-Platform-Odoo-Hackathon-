# TransitOps Team Integration Plan

This project is structured as a modular monorepo so all four developers can build independently and merge into one application.

## Ownership Boundaries

| Person | Backend Package | Frontend Feature Folder | Responsibility |
| --- | --- | --- | --- |
| Person 1 | `com.transitops.auth`, `com.transitops.dashboard`, `com.transitops.config` | `src/features/auth`, `src/features/dashboard`, `src/layouts` | Authentication, RBAC, dashboard, integration |
| Person 2 | `com.transitops.fleet` | `src/features/fleet` | Vehicles, drivers, compliance dashboard |
| Person 3 | `com.transitops.trips`, `com.transitops.maintenance` | `src/features/trips`, `src/features/maintenance` | Trips and maintenance |
| Person 4 | `com.transitops.finance`, `com.transitops.reports` | `src/features/finance`, `src/features/reports` | Fuel logs, expenses, reports, analytics |

## Backend Rules

- Each person owns only their assigned package.
- Shared reusable classes go in `com.transitops.common`.
- API routes use `/api/v1`.
- Entities must not be returned directly from controllers.
- Controllers return DTOs only.
- Business rules live in services, not controllers.
- Cross-module communication should use service interfaces or stable REST endpoints.

## Frontend Rules

- Each person owns only their assigned `src/features/*` folder.
- Shared components go in `src/components/common`.
- Shared API client setup goes in `src/api`.
- Shared layouts go in `src/layouts`.
- Feature-specific API wrappers stay inside the feature folder unless reused globally.

## Integration Contracts

Person 2 exposes these stable APIs for other modules:

```text
GET /api/v1/vehicles
GET /api/v1/vehicles/{id}
GET /api/v1/vehicles/available
GET /api/v1/drivers
GET /api/v1/drivers/{id}
GET /api/v1/drivers/available
GET /api/v1/compliance/drivers
```

Person 3 depends on:

```text
GET /api/v1/vehicles/available
GET /api/v1/drivers/available
```

Person 4 depends on:

```text
GET /api/v1/vehicles
GET /api/v1/vehicles/{id}
GET /api/v1/drivers
GET /api/v1/drivers/{id}
```

Person 1 provides:

```text
JWT authentication
RBAC roles
Axios token strategy
Protected route layout
Dashboard shell
```

## Git Strategy

Recommended branches:

```text
main
feature/person-1-auth-dashboard
feature/person-2-fleet-driver
feature/person-3-trips-maintenance
feature/person-4-finance-reports
```

Person 2 task commits should be small and pushable:

```text
chore: initialize TransitOps project foundation
chore: add modular team integration structure
feat(fleet): add vehicle enums
feat(fleet): add vehicle entity
feat(fleet): add driver entity
```

