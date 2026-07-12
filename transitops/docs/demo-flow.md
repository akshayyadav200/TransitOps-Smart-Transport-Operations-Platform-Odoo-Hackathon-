# TransitOps Demo Flow

## Credentials

Use the seeded demo accounts:

- `admin@transitops.demo`
- `fleet@transitops.demo`
- `dispatcher@transitops.demo`
- `safety@transitops.demo`
- `finance@transitops.demo`

Use the local demo password configured in `DEMO_USER_PASSWORD`.

## Happy Path

1. Log in as Admin.
2. Open Fleet and confirm `Van-05` has 500 kg capacity.
3. Confirm Alex has a valid licence.
4. Open Dispatch.
5. Create a trip with cargo weight below capacity, such as 450 kg.
6. Dispatch the trip.
7. Confirm trip, vehicle, and driver move to `Dispatched` / `On Trip`.
8. Complete the trip.
9. Confirm the trip is `Completed`, the assets return to `Available`, and odometer increased.
10. Open Maintenance.
11. Create maintenance for an available vehicle and confirm the vehicle becomes `In Shop`.
12. Confirm the vehicle is no longer available for dispatch.
13. Close maintenance and confirm the vehicle returns to `Available` unless retired.
14. Open Dashboard and Reports.
15. Confirm metrics update and export CSV reports.

## Rejected Workflow Checks

- Cargo above vehicle capacity must be rejected.
- Expired licence drivers must be rejected.
- Suspended drivers must be rejected.
- `In Shop` vehicles must be rejected.
- Retired vehicles must be rejected.
- Vehicles already `On Trip` must be rejected.
- Drivers already `On Trip` must be rejected.
- Unauthorized roles must receive `403`.

After each rejection, verify no partial state change occurred for trip, vehicle, or driver.
