import { Trip } from "../models/Trip.js";
import { buildPagination, buildSort, pageResponse } from "./queryUtils.js";
import { dateRangeFilter, referenceFilter, searchFilter } from "./reportQueryUtils.js";

const TRIP_SORT_FIELDS = ["tripCode", "origin", "destination", "region", "status", "scheduledStart", "distanceKm", "revenue", "createdAt"];

export function buildTripFilter(query = {}) {
  return {
    ...referenceFilter(query),
    ...dateRangeFilter(query, "scheduledStart"),
    ...searchFilter(query, ["tripCode", "origin", "destination", "region"]),
    ...(query.status ? { status: query.status } : {}),
    ...(query.region ? { region: query.region } : {})
  };
}

function populateTrip(query) {
  return query.populate("vehicleId", "registrationNumber name type region status acquisitionCost")
    .populate("driverId", "name licenseNumber region status");
}

export async function findTripById(id) {
  return populateTrip(Trip.findById(id));
}

export async function searchTrips(query) {
  const { page, limit, skip } = buildPagination(query);
  const filter = buildTripFilter(query);
  const sort = buildSort(query, TRIP_SORT_FIELDS, "scheduledStart");

  const [items, total] = await Promise.all([
    populateTrip(Trip.find(filter)).sort(sort).skip(skip).limit(limit),
    Trip.countDocuments(filter)
  ]);

  return pageResponse({ items, total, page, limit });
}

export async function getTripStatusBreakdown(query = {}) {
  return Trip.aggregate([
    { $match: buildTripFilter(query) },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        revenue: { $sum: "$revenue" },
        distanceKm: { $sum: "$distanceKm" }
      }
    },
    { $project: { _id: 0, status: "$_id", count: 1, revenue: 1, distanceKm: 1 } }
  ]);
}

export async function getTripTotals(query = {}) {
  const [summary] = await Trip.aggregate([
    { $match: buildTripFilter(query) },
    {
      $group: {
        _id: null,
        trips: { $sum: 1 },
        distanceKm: { $sum: "$distanceKm" },
        revenue: { $sum: "$revenue" }
      }
    }
  ]);

  return {
    trips: summary?.trips ?? 0,
    distanceKm: summary?.distanceKm ?? 0,
    revenue: summary?.revenue ?? 0
  };
}

export async function getFleetUtilizationOverTime(query = {}) {
  return Trip.aggregate([
    { $match: buildTripFilter(query) },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$scheduledStart" } },
        onTripVehicles: { $addToSet: "$vehicleId" },
        trips: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        onTripVehicles: { $size: "$onTripVehicles" },
        trips: 1
      }
    },
    { $sort: { date: 1 } }
  ]);
}
