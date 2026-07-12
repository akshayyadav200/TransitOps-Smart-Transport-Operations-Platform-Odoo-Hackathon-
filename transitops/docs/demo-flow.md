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
5. Create a trip for `Van-05` and Alex with cargo weight `450 kg`.
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

## Judge Demo Script

Use the seeded demo data or recreate it with `npm run seed:demo`.

1. Login as `admin@transitops.demo`.
2. Open Fleet and show `Van-05` with 500 kg capacity.
3. Open Safety and show Alex with a valid licence.
4. Open Dispatch and create a new trip:
   - Vehicle: `Van-05`
   - Driver: Alex
   - Cargo weight: `450`
   - Distance, fuel, and revenue: any positive demo values
5. Dispatch the trip.
6. Confirm automatic status updates:
   - Trip: `Dispatched`
   - Vehicle: `On Trip`
   - Driver: `On Trip`
7. Complete the trip.
8. Confirm automatic restoration:
   - Trip: `Completed`
   - Vehicle: `Available`
   - Driver: `Available`
9. Open Maintenance, create a job for an available vehicle, and confirm the vehicle becomes `In Shop`.
10. Return to Dispatch and confirm the in-shop vehicle is hidden from dispatch options.
11. Close maintenance and confirm the vehicle returns to `Available` unless retired.
12. Open Dashboard/Analytics and confirm metrics reflect seeded and workflow data.
13. Open Reports and export a CSV.
14. Create or attempt a `650 kg` cargo trip on `Van-05` and confirm it is rejected because capacity is 500 kg.

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
