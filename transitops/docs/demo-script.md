# TransitOps Demo Script

## Setup

1. Run `npm install`.
2. Start MongoDB locally or point `DATABASE_URL` at a reachable MongoDB instance.
3. Run `npm --workspace backend run seed:demo`.
4. Start the API with `npm run dev:backend`.
5. Start the frontend with `npm run dev:frontend`.

## Walkthrough

1. Open the dashboard and show KPI cards:
   Active vehicles, available vehicles, maintenance vehicles, drivers on duty, pending trips, fleet utilization, operational cost, fuel efficiency, ROI, fuel cost, maintenance cost, expense cost, trips today, completed trips, and cancelled trips.

2. Change global filters:
   Select a region, date range, fuel type, expense category, vehicle, trip, or status and show dashboard cards, charts, tables, and reports updating.

3. Open Fuel:
   Add a fuel record with vehicle, optional trip, liters, cost, fuel type, date, odometer, and filled by. Search and paginate the table. Edit the row, then delete it with confirmation. Show vehicle-wise and trip-wise fuel panels.

4. Open Expenses:
   Add an expense for maintenance, repair, toll, parking, insurance, fuel, or miscellaneous. Show expense cards by category, search, paginate, edit, and delete with confirmation.

5. Open Analytics:
   Show vehicle status pie, expense category bar chart, fuel cost line chart, fleet utilization area chart, and trip status donut chart.

6. Open Reports:
   Cycle through Vehicle, Trip, Fuel, Expense, Cost, and ROI reports. Use search, sorting, pagination, and filters. Export a filtered report with the CSV button.

7. Explain formulas:
   Fuel Efficiency = Distance / Fuel Consumed.
   Operational Cost = Fuel Cost + Maintenance Cost + Other Expenses.
   Fleet Utilization = On Trip Vehicles / Total Vehicles x 100.
   ROI = (Revenue - Fuel Cost - Maintenance Cost - Other Expenses) / Vehicle Acquisition Cost x 100.

## Close

TransitOps gives operations and finance teams a single live workspace for fuel, expenses, cost visibility, utilization, ROI, and exportable reporting.
