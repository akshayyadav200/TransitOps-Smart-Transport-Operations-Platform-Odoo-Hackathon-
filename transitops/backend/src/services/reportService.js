import {
  EXPENSE_CATEGORIES,
  TRIP_STATUSES,
  VEHICLE_STATUSES
} from "../constants/enums.js";
import { Expense } from "../models/Expense.js";
import { Fuel } from "../models/Fuel.js";
import { Driver } from "../models/Driver.js";
import { Trip } from "../models/Trip.js";
import { Vehicle } from "../models/Vehicle.js";
import { searchExpenses } from "../repositories/expenseRepository.js";
import { searchFuel } from "../repositories/fuelRepository.js";
import { buildPagination, buildSort, escapeRegex, pageResponse } from "../repositories/queryUtils.js";
import { dateRangeFilter } from "../repositories/reportQueryUtils.js";
import { searchTrips } from "../repositories/tripRepository.js";
import { searchVehicles } from "../repositories/vehicleRepository.js";
import {
  calculateFuelEfficiency,
  calculateOperationalCost,
  calculateRoi
} from "../utils/analyticsCalculations.js";
import { serializePage, toPlainObject } from "./serialization.js";

const VEHICLE_REPORT_SORT_FIELDS = ["registrationNumber", "name", "type", "region", "status", "acquisitionCost", "createdAt"];

function vehicleReportFilter(query = {}) {
  const filter = {};

  if (query.vehicleId) {
    filter._id = query.vehicleId;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.region) {
    filter.region = query.region;
  }

  if (query.startDate || query.endDate) {
    Object.assign(filter, dateRangeFilter(query, "createdAt"));
  }

  if (query.search) {
    const search = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [{ registrationNumber: search }, { name: search }, { model: search }, { region: search }];
  }

  return filter;
}

function financeQuery(query = {}, vehicleId) {
  return {
    ...query,
    vehicleId,
    status: undefined,
    search: undefined,
    region: undefined,
    page: undefined,
    limit: undefined,
    sort: undefined
  };
}

async function vehicleCostSummary(vehicleId, query = {}) {
  const dateFilter = dateRangeFilter(financeQuery(query, vehicleId));
  const recordFilter = { vehicleId, ...dateFilter };

  const [fuelSummary, expenseRows, tripSummary] = await Promise.all([
    Fuel.aggregate([
      { $match: recordFilter },
      { $group: { _id: null, fuelCost: { $sum: "$cost" }, liters: { $sum: "$liters" } } }
    ]),
    Expense.aggregate([
      { $match: recordFilter },
      { $group: { _id: "$category", amount: { $sum: "$amount" } } }
    ]),
    Trip.aggregate([
      { $match: { vehicleId, ...dateRangeFilter(query, "scheduledStart") } },
      { $group: { _id: null, revenue: { $sum: "$revenue" }, distanceKm: { $sum: "$distanceKm" }, trips: { $sum: 1 } } }
    ])
  ]);

  const fuelCost = fuelSummary[0]?.fuelCost ?? 0;
  const liters = fuelSummary[0]?.liters ?? 0;
  const expenseMap = Object.fromEntries(expenseRows.map((row) => [row._id, row.amount]));
  const maintenanceCost = expenseMap[EXPENSE_CATEGORIES.MAINTENANCE] ?? 0;
  const fuelExpenseCost = expenseMap[EXPENSE_CATEGORIES.FUEL] ?? 0;
  const expenseCost = expenseRows.reduce((sum, row) => sum + row.amount, 0);
  const otherExpenses = Math.max(expenseCost - maintenanceCost - fuelExpenseCost, 0);
  const revenue = tripSummary[0]?.revenue ?? 0;
  const distanceKm = tripSummary[0]?.distanceKm ?? 0;

  return {
    fuelCost,
    liters,
    maintenanceCost,
    expenseCost,
    otherExpenses,
    operationalCost: calculateOperationalCost({ fuelCost, maintenanceCost, otherExpenses }),
    revenue,
    distanceKm,
    trips: tripSummary[0]?.trips ?? 0,
    fuelEfficiency: calculateFuelEfficiency(distanceKm, liters)
  };
}

export async function getVehicleReport(query = {}) {
  if (!query.startDate && !query.endDate) {
    const result = await searchVehicles(query);
    return serializePage(result);
  }

  const { page, limit, skip } = buildPagination(query);
  const filter = vehicleReportFilter(query);
  const sort = buildSort(query, VEHICLE_REPORT_SORT_FIELDS);
  const [items, total] = await Promise.all([
    Vehicle.find(filter).sort(sort).skip(skip).limit(limit),
    Vehicle.countDocuments(filter)
  ]);

  return pageResponse({ items: items.map(toPlainObject), total, page, limit });
}

export async function getTripReport(query = {}) {
  const result = await searchTrips(query);
  return serializePage(result);
}

export async function getFuelReport(query = {}) {
  const result = await searchFuel(query);
  return serializePage(result);
}

export async function getExpenseReport(query = {}) {
  const result = await searchExpenses(query);
  return serializePage(result);
}

export async function getCostReport(query = {}) {
  const { page, limit, skip } = buildPagination(query);
  const filter = vehicleReportFilter(query);
  const sort = buildSort(query, VEHICLE_REPORT_SORT_FIELDS);
  const [vehicles, total] = await Promise.all([
    Vehicle.find(filter).sort(sort).skip(skip).limit(limit),
    Vehicle.countDocuments(filter)
  ]);

  const items = await Promise.all(
    vehicles.map(async (vehicle) => {
      const vehicleObject = toPlainObject(vehicle);
      const costs = await vehicleCostSummary(vehicle._id, query);
      return { ...vehicleObject, ...costs };
    })
  );

  return pageResponse({ items, total, page, limit });
}

export async function getRoiReport(query = {}) {
  const result = await getCostReport(query);

  return {
    ...result,
    items: result.items.map((vehicle) => ({
      ...vehicle,
      roi: calculateRoi({
        revenue: vehicle.revenue,
        fuelCost: vehicle.fuelCost,
        maintenanceCost: vehicle.maintenanceCost,
        otherExpenses: vehicle.otherExpenses,
        acquisitionCost: vehicle.acquisitionCost
      })
    }))
  };
}

export async function getReportFilterOptions() {
  const [regions, vehicles, trips, drivers] = await Promise.all([
    Vehicle.distinct("region", { region: { $ne: null } }),
    Vehicle.find().sort({ registrationNumber: 1 }).limit(250),
    Trip.find().sort({ scheduledStart: -1 }).limit(250),
    Driver.find().sort({ name: 1 }).limit(250)
  ]);

  return {
    regions,
    statuses: {
      vehicles: Object.values(VEHICLE_STATUSES),
      trips: Object.values(TRIP_STATUSES)
    },
    vehicles: vehicles.map((vehicle) => toPlainObject(vehicle)),
    trips: trips.map((trip) => toPlainObject(trip)),
    drivers: drivers.map((driver) => toPlainObject(driver))
  };
}
