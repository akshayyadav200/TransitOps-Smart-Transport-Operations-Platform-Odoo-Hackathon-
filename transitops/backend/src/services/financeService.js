import { EXPENSE_CATEGORIES, TRIP_STATUSES, VEHICLE_STATUSES } from "../constants/enums.js";
import { Driver } from "../models/Driver.js";
import { Expense } from "../models/Expense.js";
import { FuelLog } from "../models/FuelLog.js";
import { Trip } from "../models/Trip.js";
import { Vehicle } from "../models/Vehicle.js";
import { assertValidObjectId, createServiceError } from "./operationsService.js";

const financePopulate = [
  { path: "vehicle", select: "registrationNumber name status region" },
  { path: "trip", select: "tripNumber source destination status distance revenue" }
];

export function buildDateFilter({ startDate, endDate } = {}, field) {
  const range = {};

  if (startDate) {
    const start = new Date(startDate);
    if (Number.isNaN(start.getTime())) {
      throw createServiceError(400, "Invalid date filter", [{ field: "startDate", message: "startDate must be a valid date" }]);
    }
    range.$gte = start;
  }

  if (endDate) {
    const end = new Date(endDate);
    if (Number.isNaN(end.getTime())) {
      throw createServiceError(400, "Invalid date filter", [{ field: "endDate", message: "endDate must be a valid date" }]);
    }
    end.setHours(23, 59, 59, 999);
    range.$lte = end;
  }

  return Object.keys(range).length > 0 ? { [field]: range } : {};
}

export function buildFinanceFilter(query, dateField) {
  const filter = {
    ...buildDateFilter(query, dateField)
  };

  if (query.vehicle) {
    assertValidObjectId(query.vehicle, "vehicle");
    filter.vehicle = query.vehicle;
  }

  if (query.trip) {
    assertValidObjectId(query.trip, "trip");
    filter.trip = query.trip;
  }

  if (query.region) {
    filter.region = query.region;
  }

  if (query.category) {
    filter.category = query.category;
  }

  return filter;
}

function pickFuelPayload(body, userId) {
  return {
    vehicle: body.vehicle,
    trip: body.trip || null,
    liters: Number(body.liters),
    cost: Number(body.cost),
    odometer: body.odometer === undefined || body.odometer === "" ? 0 : Number(body.odometer),
    filledAt: body.filledAt || new Date(),
    vendor: body.vendor || null,
    region: body.region || null,
    updatedBy: userId
  };
}

function pickExpensePayload(body, userId) {
  return {
    category: body.category || EXPENSE_CATEGORIES.OTHER,
    amount: Number(body.amount),
    description: body.description,
    vehicle: body.vehicle || null,
    trip: body.trip || null,
    expenseDate: body.expenseDate || new Date(),
    region: body.region || null,
    updatedBy: userId
  };
}

export async function listFuelLogs(query) {
  return FuelLog.find(buildFinanceFilter(query, "filledAt")).populate(financePopulate).sort({ filledAt: -1 }).limit(200);
}

export async function createFuelLog(body, userId) {
  assertValidObjectId(body.vehicle, "vehicle");
  if (body.trip) {
    assertValidObjectId(body.trip, "trip");
  }

  const fuelLog = await FuelLog.create({ ...pickFuelPayload(body, userId), createdBy: userId });
  return fuelLog.populate(financePopulate);
}

export async function updateFuelLog(id, body, userId) {
  assertValidObjectId(id);
  const fuelLog = await FuelLog.findByIdAndUpdate(id, pickFuelPayload(body, userId), { new: true, runValidators: true }).populate(financePopulate);
  if (!fuelLog) {
    throw createServiceError(404, "Fuel log not found");
  }
  return fuelLog;
}

export async function deleteFuelLog(id) {
  assertValidObjectId(id);
  const fuelLog = await FuelLog.findByIdAndDelete(id);
  if (!fuelLog) {
    throw createServiceError(404, "Fuel log not found");
  }
  return fuelLog;
}

export async function listExpenses(query) {
  return Expense.find(buildFinanceFilter(query, "expenseDate")).populate(financePopulate).sort({ expenseDate: -1 }).limit(200);
}

export async function createExpense(body, userId) {
  if (body.vehicle) {
    assertValidObjectId(body.vehicle, "vehicle");
  }
  if (body.trip) {
    assertValidObjectId(body.trip, "trip");
  }

  const expense = await Expense.create({ ...pickExpensePayload(body, userId), createdBy: userId });
  return expense.populate(financePopulate);
}

export async function updateExpense(id, body, userId) {
  assertValidObjectId(id);
  const expense = await Expense.findByIdAndUpdate(id, pickExpensePayload(body, userId), { new: true, runValidators: true }).populate(financePopulate);
  if (!expense) {
    throw createServiceError(404, "Expense not found");
  }
  return expense;
}

export async function deleteExpense(id) {
  assertValidObjectId(id);
  const expense = await Expense.findByIdAndDelete(id);
  if (!expense) {
    throw createServiceError(404, "Expense not found");
  }
  return expense;
}

export async function getDashboardMetrics(query = {}) {
  const [vehicleCounts, driverCounts, tripCounts, fuelAgg, expenseAgg, revenueAgg] = await Promise.all([
    Vehicle.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Driver.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Trip.aggregate([{ $group: { _id: "$status", count: { $sum: 1 }, revenue: { $sum: "$revenue" }, distance: { $sum: "$distance" } } }]),
    FuelLog.aggregate([
      { $match: buildFinanceFilter(query, "filledAt") },
      { $group: { _id: null, liters: { $sum: "$liters" }, cost: { $sum: "$cost" } } }
    ]),
    Expense.aggregate([
      { $match: buildFinanceFilter(query, "expenseDate") },
      { $group: { _id: "$category", amount: { $sum: "$amount" } } }
    ]),
    Trip.aggregate([{ $match: { status: { $ne: TRIP_STATUSES.CANCELLED } } }, { $group: { _id: null, revenue: { $sum: "$revenue" }, distance: { $sum: "$distance" } } }])
  ]);

  const vehicleByStatus = Object.fromEntries(vehicleCounts.map((item) => [item._id, item.count]));
  const driverByStatus = Object.fromEntries(driverCounts.map((item) => [item._id, item.count]));
  const tripByStatus = Object.fromEntries(tripCounts.map((item) => [item._id, item.count]));
  const totalExpense = expenseAgg.reduce((sum, item) => sum + item.amount, 0);
  const totalFuelCost = fuelAgg[0]?.cost ?? 0;
  const totalCost = totalExpense + totalFuelCost;
  const totalRevenue = revenueAgg[0]?.revenue ?? 0;
  const totalDistance = revenueAgg[0]?.distance ?? 0;
  const totalLiters = fuelAgg[0]?.liters ?? 0;
  const activeVehicles = vehicleByStatus[VEHICLE_STATUSES.ON_TRIP] ?? 0;
  const availableVehicles = vehicleByStatus[VEHICLE_STATUSES.AVAILABLE] ?? 0;
  const totalVehicles = Object.values(vehicleByStatus).reduce((sum, count) => sum + count, 0);

  return {
    cards: {
      activeVehicles,
      availableVehicles,
      vehiclesInMaintenance: vehicleByStatus[VEHICLE_STATUSES.IN_SHOP] ?? 0,
      driversOnDuty: driverByStatus["On Trip"] ?? 0,
      pendingTrips: tripByStatus[TRIP_STATUSES.DRAFT] ?? 0,
      fleetUtilization: totalVehicles > 0 ? Number(((activeVehicles / totalVehicles) * 100).toFixed(1)) : 0,
      operationalCost: totalCost,
      fuelEfficiency: totalDistance > 0 ? Number((totalLiters / totalDistance).toFixed(2)) : 0,
      roi: totalCost > 0 ? Number((((totalRevenue - totalCost) / totalCost) * 100).toFixed(1)) : 0
    },
    charts: {
      vehicleStatus: Object.entries(vehicleByStatus).map(([label, value]) => ({ label, value })),
      tripStatus: Object.entries(tripByStatus).map(([label, value]) => ({ label, value })),
      expenseAnalysis: expenseAgg.map((item) => ({ label: item._id, value: item.amount })),
      fuelAnalysis: [{ label: "Liters", value: totalLiters }, { label: "Cost", value: totalFuelCost }],
      fleetUtilization: [
        { label: "Active", value: activeVehicles },
        { label: "Available", value: availableVehicles },
        { label: "Maintenance", value: vehicleByStatus[VEHICLE_STATUSES.IN_SHOP] ?? 0 }
      ]
    }
  };
}

export async function getReports(query = {}) {
  const [vehicles, trips, fuelLogs, expenses] = await Promise.all([
    Vehicle.find(query.status ? { status: query.status } : {}).sort({ registrationNumber: 1 }).limit(500),
    Trip.find(query.status ? { status: query.status } : {}).populate("vehicle driver").sort({ createdAt: -1 }).limit(500),
    listFuelLogs(query),
    listExpenses(query)
  ]);

  return {
    vehicleReport: vehicles,
    tripReport: trips,
    fuelReport: fuelLogs,
    costReport: expenses,
    roiReport: await getDashboardMetrics(query)
  };
}

