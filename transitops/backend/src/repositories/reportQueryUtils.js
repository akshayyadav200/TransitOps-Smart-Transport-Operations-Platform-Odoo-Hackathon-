import mongoose from "mongoose";
import { escapeRegex } from "./queryUtils.js";

function castObjectId(value) {
  if (mongoose.isValidObjectId(value)) {
    return new mongoose.Types.ObjectId(value);
  }

  return value;
}

export function dateRangeFilter(query = {}, field = "date") {
  const range = {};

  if (query.startDate) {
    range.$gte = new Date(query.startDate);
  }

  if (query.endDate) {
    const end = new Date(query.endDate);
    end.setHours(23, 59, 59, 999);
    range.$lte = end;
  }

  return Object.keys(range).length > 0 ? { [field]: range } : {};
}

export function referenceFilter(query = {}, options = {}) {
  const config = { vehicle: true, trip: true, driver: true, ...options };
  const filter = {};

  if (config.vehicle && query.vehicleId) {
    filter.vehicleId = castObjectId(query.vehicleId);
  }

  if (config.trip && query.tripId) {
    filter.tripId = castObjectId(query.tripId);
  }

  if (config.driver && query.driverId) {
    filter.driverId = castObjectId(query.driverId);
  }

  return filter;
}

export function searchFilter(query, fields) {
  if (!query?.search) {
    return {};
  }

  const search = new RegExp(escapeRegex(query.search), "i");
  return {
    $or: fields.map((field) => ({ [field]: search }))
  };
}
