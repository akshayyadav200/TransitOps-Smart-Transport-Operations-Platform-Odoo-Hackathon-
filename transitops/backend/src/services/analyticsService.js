import mongoose from "mongoose";
import {
  DRIVER_STATUSES,
  EXPENSE_CATEGORIES,
  TRIP_STATUSES,
  VEHICLE_STATUSES
} from "../constants/enums.js";
import { Driver } from "../models/Driver.js";
import { Expense } from "../models/Expense.js";
import { Trip } from "../models/Trip.js";
import { Vehicle } from "../models/Vehicle.js";
import { getExpenseCategoryBreakdown } from "../repositories/expenseRepository.js";
import { getFuelCostOverTime, getFuelTotals } from "../repositories/fuelRepository.js";
import { dateRangeFilter, referenceFilter } from "../repositories/reportQueryUtils.js";
import { getFleetUtilizationOverTime, getTripStatusBreakdown, getTripTotals } from "../repositories/tripRepository.js";
import {
  calculateFleetUtilization,
  calculateFuelEfficiency,
  calculateOperationalCost,
  calculateRoi
} from "../utils/analyticsCalculations.js";

function castObjectId(value) {
  return mongoose.isValidObjectId(value) ? new mongoose.Types.ObjectId(value) : value;
}

function vehicleFilter(query = {}) {
  return {
    ...(query.vehicleId ? { _id: castObjectId(query.vehicleId) } : {}),
    ...(query.region ? { region: query.region } : {}),
    ...(query.status ? { status: query.status } : {})
  };
}

function driverFilter(query = {}) {
  return {
    ...(query.driverId ? { _id: castObjectId(query.driverId) } : {}),
    ...(query.region ? { region: query.region } : {})
  };
}

function tripFilter(query = {}) {
  return {
    ...referenceFilter(query, { driver: false }),
    ...dateRangeFilter(query, "scheduledStart"),
    ...(query.region ? { region: query.region } : {}),
    ...(query.status ? { status: query.status } : {})
  };
}

function expenseFilter(query = {}) {
  return {
    ...referenceFilter(query),
    ...dateRangeFilter(query),
    ...(query.category ? { category: query.category } : {})
  };
}

async function vehicleStatusBreakdown(query = {}) {
  const rows = await Vehicle.aggregate([
    { $match: vehicleFilter(query) },
    { $group: { _id: "$status", count: { $sum: 1 } } },
    { $project: { _id: 0, status: "$_id", count: 1 } }
  ]);

  return Object.values(VEHICLE_STATUSES).map((status) => ({
    status,
    count: rows.find((row) => row.status === status)?.count ?? 0
  }));
}

async function expenseTotals(query = {}) {
  const filter = expenseFilter(query);
  const rows = await Expense.aggregate([
    { $match: filter },
    {
      $group: {
        _id: "$category",
        amount: { $sum: "$amount" }
      }
    }
  ]);

  const byCategory = Object.fromEntries(rows.map((row) => [row._id, row.amount]));
  const total = rows.reduce((sum, row) => sum + row.amount, 0);
  const maintenanceCost = byCategory[EXPENSE_CATEGORIES.MAINTENANCE] ?? 0;
  const fuelExpenseCost = byCategory[EXPENSE_CATEGORIES.FUEL] ?? 0;
  const otherExpenses = Math.max(total - maintenanceCost - fuelExpenseCost, 0);

  return {
    total,
    maintenanceCost,
    fuelExpenseCost,
    otherExpenses
  };
}

async function acquisitionCost(query = {}) {
  const [summary] = await Vehicle.aggregate([
    { $match: vehicleFilter(query) },
    { $group: { _id: null, acquisitionCost: { $sum: "$acquisitionCost" } } }
  ]);

  return summary?.acquisitionCost ?? 0;
}

async function tripsToday(query = {}) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setHours(23, 59, 59, 999);

  return Trip.countDocuments({
    ...tripFilter({ ...query, status: undefined }),
    scheduledStart: { $gte: start, $lte: end }
  });
}

async function fleetUtilization(query = {}) {
  const [totalVehicles, onTripVehicles] = await Promise.all([
    Vehicle.countDocuments(vehicleFilter({ ...query, status: undefined })),
    Vehicle.countDocuments({ ...vehicleFilter({ ...query, status: undefined }), status: VEHICLE_STATUSES.ON_TRIP })
  ]);

  return {
    totalVehicles,
    onTripVehicles,
    utilization: calculateFleetUtilization(onTripVehicles, totalVehicles)
  };
}

export async function getAnalyticsSummary(query = {}) {
  const [
    totalVehicles,
    activeVehicles,
    availableVehicles,
    vehiclesInMaintenance,
    driversOnDuty,
    pendingTrips,
    completedTrips,
    cancelledTrips,
    todayTrips,
    fuelTotals,
    expenses,
    trips,
    acquisition,
    utilization,
    vehicleStatus,
    expenseCategories,
    fuelCostOverTime,
    utilizationOverTime,
    tripStatus
  ] = await Promise.all([
    Vehicle.countDocuments(vehicleFilter({ ...query, status: undefined })),
    Vehicle.countDocuments({ ...vehicleFilter({ ...query, status: undefined }), status: { $ne: VEHICLE_STATUSES.RETIRED } }),
    Vehicle.countDocuments({ ...vehicleFilter({ ...query, status: undefined }), status: VEHICLE_STATUSES.AVAILABLE }),
    Vehicle.countDocuments({ ...vehicleFilter({ ...query, status: undefined }), status: VEHICLE_STATUSES.IN_SHOP }),
    Driver.countDocuments({ ...driverFilter(query), status: DRIVER_STATUSES.ON_TRIP }),
    Trip.countDocuments({ ...tripFilter({ ...query, status: undefined }), status: { $in: [TRIP_STATUSES.DRAFT, TRIP_STATUSES.DISPATCHED] } }),
    Trip.countDocuments({ ...tripFilter({ ...query, status: undefined }), status: TRIP_STATUSES.COMPLETED }),
    Trip.countDocuments({ ...tripFilter({ ...query, status: undefined }), status: TRIP_STATUSES.CANCELLED }),
    tripsToday(query),
    getFuelTotals(query),
    expenseTotals(query),
    getTripTotals(query),
    acquisitionCost(query),
    fleetUtilization(query),
    vehicleStatusBreakdown(query),
    getExpenseCategoryBreakdown(query),
    getFuelCostOverTime(query),
    getFleetUtilizationOverTime(query),
    getTripStatusBreakdown(query)
  ]);

  const operationalCost = calculateOperationalCost({
    fuelCost: fuelTotals.cost,
    maintenanceCost: expenses.maintenanceCost,
    otherExpenses: expenses.otherExpenses
  });

  const fuelEfficiency = calculateFuelEfficiency(trips.distanceKm, fuelTotals.liters);
  const roi = calculateRoi({
    revenue: trips.revenue,
    fuelCost: fuelTotals.cost,
    maintenanceCost: expenses.maintenanceCost,
    otherExpenses: expenses.otherExpenses,
    acquisitionCost: acquisition
  });

  return {
    kpis: {
      activeVehicles,
      availableVehicles,
      vehiclesInMaintenance,
      driversOnDuty,
      pendingTrips,
      fleetUtilization: utilization.utilization,
      operationalCost,
      fuelEfficiency,
      roi,
      fuelCost: fuelTotals.cost,
      maintenanceCost: expenses.maintenanceCost,
      expenseCost: expenses.total,
      tripsToday: todayTrips,
      completedTrips,
      cancelledTrips,
      totalVehicles
    },
    charts: {
      vehicleStatus,
      expenseCategories,
      fuelCostOverTime,
      fleetUtilization: utilizationOverTime.map((point) => ({
        ...point,
        utilization: calculateFleetUtilization(point.onTripVehicles, utilization.totalVehicles)
      })),
      tripStatus: Object.values(TRIP_STATUSES).map((status) => ({
        status,
        count: tripStatus.find((row) => row.status === status)?.count ?? 0
      }))
    }
  };
}
