import { Fuel } from "../models/Fuel.js";
import { buildPagination, buildSort, pageResponse } from "./queryUtils.js";
import { dateRangeFilter, referenceFilter, searchFilter } from "./reportQueryUtils.js";

const FUEL_SORT_FIELDS = ["date", "liters", "cost", "fuelType", "odometer", "filledBy", "createdAt"];

function buildFuelFilter(query = {}) {
  return {
    ...referenceFilter(query, { driver: false }),
    ...dateRangeFilter(query),
    ...searchFilter(query, ["filledBy", "fuelType"]),
    ...(query.fuelType ? { fuelType: query.fuelType } : {})
  };
}

function populateFuel(query) {
  return query.populate("vehicleId", "registrationNumber name type region status acquisitionCost")
    .populate("tripId", "tripCode origin destination status distanceKm revenue scheduledStart region");
}

export async function createFuel(data) {
  const fuel = await Fuel.create(data);
  return populateFuel(Fuel.findById(fuel._id));
}

export async function findFuelById(id) {
  return populateFuel(Fuel.findById(id));
}

export async function updateFuelById(id, data) {
  return populateFuel(Fuel.findByIdAndUpdate(id, data, { new: true, runValidators: true }));
}

export async function deleteFuelById(id) {
  return populateFuel(Fuel.findByIdAndDelete(id));
}

export async function searchFuel(query) {
  const { page, limit, skip } = buildPagination(query);
  const filter = buildFuelFilter(query);
  const sort = buildSort(query, FUEL_SORT_FIELDS, "date");

  const [items, total] = await Promise.all([
    populateFuel(Fuel.find(filter)).sort(sort).skip(skip).limit(limit),
    Fuel.countDocuments(filter)
  ]);

  return pageResponse({ items, total, page, limit });
}

export async function getFuelTotals(query = {}) {
  const [summary] = await Fuel.aggregate([
    { $match: buildFuelFilter(query) },
    {
      $group: {
        _id: null,
        liters: { $sum: "$liters" },
        cost: { $sum: "$cost" },
        records: { $sum: 1 }
      }
    }
  ]);

  return {
    liters: summary?.liters ?? 0,
    cost: summary?.cost ?? 0,
    records: summary?.records ?? 0
  };
}

export async function getVehicleWiseFuel(query = {}) {
  return Fuel.aggregate([
    { $match: buildFuelFilter(query) },
    {
      $group: {
        _id: "$vehicleId",
        liters: { $sum: "$liters" },
        cost: { $sum: "$cost" },
        records: { $sum: 1 },
        lastFill: { $max: "$date" }
      }
    },
    {
      $lookup: {
        from: "vehicles",
        localField: "_id",
        foreignField: "_id",
        as: "vehicle"
      }
    },
    { $unwind: { path: "$vehicle", preserveNullAndEmptyArrays: true } },
    { $sort: { cost: -1 } }
  ]);
}

export async function getTripWiseFuel(query = {}) {
  const filter = buildFuelFilter(query);
  if (!filter.tripId) {
    filter.tripId = { $ne: null };
  }

  return Fuel.aggregate([
    { $match: filter },
    {
      $group: {
        _id: "$tripId",
        liters: { $sum: "$liters" },
        cost: { $sum: "$cost" },
        records: { $sum: 1 },
        lastFill: { $max: "$date" }
      }
    },
    {
      $lookup: {
        from: "trips",
        localField: "_id",
        foreignField: "_id",
        as: "trip"
      }
    },
    { $unwind: { path: "$trip", preserveNullAndEmptyArrays: true } },
    { $sort: { cost: -1 } }
  ]);
}

export async function getFuelCostOverTime(query = {}) {
  return Fuel.aggregate([
    { $match: buildFuelFilter(query) },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        cost: { $sum: "$cost" },
        liters: { $sum: "$liters" }
      }
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, date: "$_id", cost: 1, liters: 1 } }
  ]);
}
