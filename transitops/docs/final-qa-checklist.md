# Final QA Checklist

## Git And Hygiene

- [ ] Current branch is `feature/auth-core`.
- [ ] Working tree is clean before final commit.
- [ ] No merge or rebase is active.
- [ ] No real `.env` files are tracked.
- [ ] No secrets, API keys, database credentials, password hashes, or tokens are committed.
- [ ] `node_modules`, build output, caches, and IDE files are ignored.

## Authentication And RBAC

- [ ] Valid login succeeds.
- [ ] Invalid login returns a generic error.
- [ ] `/api/auth/me` restores the current user after refresh.
- [ ] Logout clears the session.
- [ ] Protected routes reject unauthenticated users.
- [ ] Forbidden roles receive a clean Unauthorized state and backend `403`.

## Fleet And Safety

- [ ] Vehicle create works.
- [ ] Duplicate registration is rejected.
- [ ] Vehicle edit works.
- [ ] Retired, in-shop, and on-trip vehicles are excluded from dispatch.
- [ ] Driver create works.
- [ ] Expired licence, suspended, and on-trip drivers are blocked from dispatch.
- [ ] Safety/compliance dashboard loads for allowed roles.

## Trips And Maintenance

- [ ] Trip create works.
- [ ] Dispatch changes trip to `Dispatched`, vehicle to `On Trip`, and driver to `On Trip`.
- [ ] Over-capacity cargo is rejected.
- [ ] Complete restores vehicle and driver to `Available`.
- [ ] Cancel restores vehicle and driver where applicable.
- [ ] Invalid state transitions are rejected.
- [ ] Maintenance create moves vehicle to `In Shop`.
- [ ] In-shop vehicle disappears from dispatch options.
- [ ] Maintenance close restores vehicle to `Available` unless retired.

## Finance, Dashboard, And Reports

- [ ] Fuel log create works.
- [ ] Expense create works.
- [ ] Negative fuel and expense values are rejected.
- [ ] Dashboard KPI cards render.
- [ ] Filters do not break dashboard/report loading.
- [ ] Reports show fuel efficiency, operational cost, and ROI data.
- [ ] CSV export returns a downloadable CSV response.

## Deployment Readiness

- [ ] Backend lint passes.
- [ ] Backend tests pass.
- [ ] Frontend lint passes.
- [ ] Frontend production build passes.
- [ ] Backend start command works.
- [ ] Health endpoint returns database `connected`.
- [ ] CORS accepts the configured frontend origin.
- [ ] Frontend route refresh returns the SPA for protected paths.
- [ ] Browser console has no current runtime errors after reload.

## Decision

- [ ] SAFE TO MERGE: YES
