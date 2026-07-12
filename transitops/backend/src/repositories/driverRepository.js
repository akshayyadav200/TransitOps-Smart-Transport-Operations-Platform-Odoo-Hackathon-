import { DRIVER_STATUSES } from "../constants/enums.js";
import { Driver } from "../models/Driver.js";
import { buildPagination, buildSort, escapeRegex, pageResponse } from "./queryUtils.js";

const DRIVER_SORT_FIELDS = [
  "name",
  "licenseNumber",
  "licenseCategory",
  "licenseExpiryDate",
  "safetyScore",
  "region",
  "status",
  "createdAt"
];

export function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function soonLicenseDate(days = 30) {
  const date = startOfToday();
  date.setDate(date.getDate() + days);
  return date;
}

function buildDriverFilter(query = {}) {
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.licenseCategory) {
    filter.licenseCategory = query.licenseCategory;
  }

  if (query.region) {
    filter.region = query.region;
  }

  if (query.licenseValidity === "expired") {
    filter.licenseExpiryDate = { $lt: startOfToday() };
  }

  if (query.licenseValidity === "valid") {
    filter.licenseExpiryDate = { $gte: startOfToday() };
  }

  if (query.licenseValidity === "expiringSoon") {
    filter.licenseExpiryDate = { $gte: startOfToday(), $lte: soonLicenseDate() };
  }

  if (query.search) {
    const search = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [{ name: search }, { licenseNumber: search }, { contactNumber: search }, { region: search }];
  }

  return filter;
}

export async function createDriver(data) {
  return Driver.create(data);
}

export async function findDriverById(id) {
  return Driver.findById(id);
}

export async function findDriverByLicenseNumber(licenseNumber) {
  return Driver.findOne({ licenseNumber });
}

export async function updateDriverById(id, data) {
  return Driver.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function deleteDriverById(id) {
  return Driver.findByIdAndDelete(id);
}

export async function searchDrivers(query) {
  const { page, limit, skip } = buildPagination(query);
  const filter = buildDriverFilter(query);
  const sort = buildSort(query, DRIVER_SORT_FIELDS);

  const [items, total] = await Promise.all([
    Driver.find(filter).sort(sort).skip(skip).limit(limit),
    Driver.countDocuments(filter)
  ]);

  return pageResponse({ items, total, page, limit });
}

export async function findAvailableDrivers(query = {}) {
  const { page, limit, skip } = buildPagination(query);
  const filter = {
    ...buildDriverFilter(query),
    status: DRIVER_STATUSES.AVAILABLE,
    licenseExpiryDate: { $gte: startOfToday() }
  };
  const sort = buildSort(query, DRIVER_SORT_FIELDS);

  const [items, total] = await Promise.all([
    Driver.find(filter).sort(sort).skip(skip).limit(limit),
    Driver.countDocuments(filter)
  ]);

  return pageResponse({ items, total, page, limit });
}

export async function getDriverComplianceCounts() {
  const today = startOfToday();
  const soon = soonLicenseDate();

  const [totalDrivers, expiredLicenses, licensesExpiringSoon, suspendedDrivers, scoreAggregate] = await Promise.all([
    Driver.countDocuments(),
    Driver.countDocuments({ licenseExpiryDate: { $lt: today } }),
    Driver.countDocuments({ licenseExpiryDate: { $gte: today, $lte: soon } }),
    Driver.countDocuments({ status: DRIVER_STATUSES.SUSPENDED }),
    Driver.aggregate([{ $group: { _id: null, averageSafetyScore: { $avg: "$safetyScore" } } }])
  ]);

  return {
    totalDrivers,
    validLicenses: Math.max(totalDrivers - expiredLicenses, 0),
    expiredLicenses,
    licensesExpiringSoon,
    averageSafetyScore: Number((scoreAggregate[0]?.averageSafetyScore ?? 0).toFixed(2)),
    suspendedDrivers
  };
}

