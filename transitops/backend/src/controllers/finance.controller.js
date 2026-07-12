import {
  createExpense,
  createFuelLog,
  deleteExpense,
  deleteFuelLog,
  getDashboardMetrics,
  getReports,
  listExpenses,
  listFuelLogs,
  updateExpense,
  updateFuelLog
} from "../services/financeService.js";
import { successResponse } from "../utils/apiResponse.js";

function csvEscape(value) {
  if (value === null || value === undefined) {
    return "";
  }
  return `"${String(value).replaceAll('"', '""')}"`;
}

function toCsv(rows) {
  if (rows.length === 0) {
    return "type,message\r\nempty,No records\r\n";
  }
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row[header])).join(","));
  }
  return lines.join("\r\n");
}

export async function getFuelLogs(req, res, next) {
  try {
    const fuelLogs = await listFuelLogs(req.query);
    return successResponse(res, { message: "Fuel logs retrieved", data: { fuelLogs } });
  } catch (error) {
    return next(error);
  }
}

export async function postFuelLog(req, res, next) {
  try {
    const fuelLog = await createFuelLog(req.body, req.auth.userId);
    return successResponse(res, { statusCode: 201, message: "Fuel log created", data: { fuelLog } });
  } catch (error) {
    return next(error);
  }
}

export async function putFuelLog(req, res, next) {
  try {
    const fuelLog = await updateFuelLog(req.params.id, req.body, req.auth.userId);
    return successResponse(res, { message: "Fuel log updated", data: { fuelLog } });
  } catch (error) {
    return next(error);
  }
}

export async function removeFuelLog(req, res, next) {
  try {
    await deleteFuelLog(req.params.id);
    return successResponse(res, { message: "Fuel log deleted", data: {} });
  } catch (error) {
    return next(error);
  }
}

export async function getExpenses(req, res, next) {
  try {
    const expenses = await listExpenses(req.query);
    return successResponse(res, { message: "Expenses retrieved", data: { expenses } });
  } catch (error) {
    return next(error);
  }
}

export async function postExpense(req, res, next) {
  try {
    const expense = await createExpense(req.body, req.auth.userId);
    return successResponse(res, { statusCode: 201, message: "Expense created", data: { expense } });
  } catch (error) {
    return next(error);
  }
}

export async function putExpense(req, res, next) {
  try {
    const expense = await updateExpense(req.params.id, req.body, req.auth.userId);
    return successResponse(res, { message: "Expense updated", data: { expense } });
  } catch (error) {
    return next(error);
  }
}

export async function removeExpense(req, res, next) {
  try {
    await deleteExpense(req.params.id);
    return successResponse(res, { message: "Expense deleted", data: {} });
  } catch (error) {
    return next(error);
  }
}

export async function getDashboard(req, res, next) {
  try {
    const dashboard = await getDashboardMetrics(req.query);
    return successResponse(res, { message: "Dashboard retrieved", data: { dashboard } });
  } catch (error) {
    return next(error);
  }
}

export async function getReportData(req, res, next) {
  try {
    const reports = await getReports(req.query);
    return successResponse(res, { message: "Reports retrieved", data: { reports } });
  } catch (error) {
    return next(error);
  }
}

export async function exportReportCsv(req, res, next) {
  try {
    const reports = await getReports(req.query);
    const type = req.query.type ?? "cost";
    const rowsByType = {
      vehicle: reports.vehicleReport.map((vehicle) => ({
        registrationNumber: vehicle.registrationNumber,
        name: vehicle.name,
        status: vehicle.status,
        odometer: vehicle.odometer
      })),
      trip: reports.tripReport.map((trip) => ({
        tripNumber: trip.tripNumber,
        route: `${trip.source} to ${trip.destination}`,
        status: trip.status,
        revenue: trip.revenue,
        distance: trip.distance
      })),
      fuel: reports.fuelReport.map((fuel) => ({
        vehicle: fuel.vehicle?.registrationNumber,
        trip: fuel.trip?.tripNumber,
        liters: fuel.liters,
        cost: fuel.cost,
        filledAt: fuel.filledAt
      })),
      cost: reports.costReport.map((expense) => ({
        category: expense.category,
        amount: expense.amount,
        description: expense.description,
        expenseDate: expense.expenseDate
      })),
      roi: [{ ...reports.roiReport.cards }]
    };

    const csv = toCsv(rowsByType[type] ?? rowsByType.cost);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="transitops-${type}-report.csv"`);
    return res.status(200).send(csv);
  } catch (error) {
    return next(error);
  }
}
