import { Vehicle } from "../models/Vehicle.js";
import { VEHICLE_STATUSES } from "../constants/enums.js";
import { buildPagination, buildSort, escapeRegex, pageResponse } from "./queryUtils.js";

const VEHICLE_SORT_FIELDS = [
  "registrationNumber",
  "name",
  "type",
  "maximumLoadCapacity",
  "odometer",
  "acquisitionCost",
  "region",
  "status",
  "createdAt"
];

function buildVehicleFilter(query = {}) {
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.type) {
    filter.type = query.type;
  }

  if (query.region) {
    filter.region = query.region;
  }

  if (query.search) {
    const search = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [{ registrationNumber: search }, { name: search }, { model: search }, { region: search }];
  }

  return filter;
}

export async function createVehicle(data) {
  return Vehicle.create(data);
}

export async function findVehicleById(id) {
  return Vehicle.findById(id);
}

export async function findVehicleByRegistrationNumber(registrationNumber) {
  return Vehicle.findOne({ registrationNumber });
}

export async function updateVehicleById(id, data) {
  return Vehicle.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function deleteVehicleById(id) {
  return Vehicle.findByIdAndDelete(id);
}

export async function searchVehicles(query) {
  const { page, limit, skip } = buildPagination(query);
  const filter = buildVehicleFilter(query);
  const sort = buildSort(query, VEHICLE_SORT_FIELDS);

  const [items, total] = await Promise.all([
    Vehicle.find(filter).sort(sort).skip(skip).limit(limit),
    Vehicle.countDocuments(filter)
  ]);

  return pageResponse({ items, total, page, limit });
}

export async function findAvailableVehicles(query = {}) {
  const { page, limit, skip } = buildPagination(query);
  const filter = {
    ...buildVehicleFilter(query),
    status: VEHICLE_STATUSES.AVAILABLE
  };
  const sort = buildSort(query, VEHICLE_SORT_FIELDS);

  const [items, total] = await Promise.all([
    Vehicle.find(filter).sort(sort).skip(skip).limit(limit),
    Vehicle.countDocuments(filter)
  ]);

  return pageResponse({ items, total, page, limit });
}

