import mongoose from "mongoose";
import { DRIVER_STATUSES, MAINTENANCE_STATUSES, TRIP_STATUSES, VEHICLE_STATUSES } from "../constants/enums.js";

export function createServiceError(statusCode, message, errors = []) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
}

export function assertValidObjectId(id, field = "id") {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createServiceError(400, "Invalid identifier", [{ field, message: "Invalid identifier format" }]);
  }
}

function isExpired(date) {
  if (!date) {
    return true;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(date);
  expiry.setHours(0, 0, 0, 0);

  return expiry < today;
}

function ensureVehicleDispatchReady(vehicle, cargoWeight) {
  if (!vehicle) {
    throw createServiceError(404, "Vehicle not found");
  }

  if (vehicle.status === VEHICLE_STATUSES.RETIRED) {
    throw createServiceError(400, "Retired vehicles cannot be dispatched");
  }

  if (vehicle.status === VEHICLE_STATUSES.IN_SHOP) {
    throw createServiceError(400, "Vehicle is in shop and cannot be dispatched");
  }

  if (vehicle.status !== VEHICLE_STATUSES.AVAILABLE) {
    throw createServiceError(400, "Vehicle is already busy");
  }

  if (Number(cargoWeight) > Number(vehicle.maximumLoadCapacity)) {
    throw createServiceError(400, "Cargo weight exceeds vehicle capacity");
  }
}

function ensureDriverDispatchReady(driver) {
  if (!driver) {
    throw createServiceError(404, "Driver not found");
  }

  if (driver.status === DRIVER_STATUSES.SUSPENDED) {
    throw createServiceError(400, "Suspended drivers cannot be dispatched");
  }

  if (isExpired(driver.licenseExpiryDate)) {
    throw createServiceError(400, "Driver license is expired");
  }

  if (driver.status !== DRIVER_STATUSES.AVAILABLE) {
    throw createServiceError(400, "Driver is already busy");
  }
}

export function assertTripDispatchReady({ trip, vehicle, driver }) {
  if (!trip) {
    throw createServiceError(404, "Trip not found");
  }

  if (trip.status !== TRIP_STATUSES.DRAFT) {
    throw createServiceError(400, `Cannot dispatch a trip with status ${trip.status}`);
  }

  ensureVehicleDispatchReady(vehicle, trip.cargoWeight);
  ensureDriverDispatchReady(driver);
}

export async function dispatchTrip({ trip, vehicle, driver, userId }) {
  assertTripDispatchReady({ trip, vehicle, driver });

  trip.status = TRIP_STATUSES.DISPATCHED;
  trip.dispatchedAt = new Date();
  trip.updatedBy = userId;
  trip.timeline.push({
    status: TRIP_STATUSES.DISPATCHED,
    note: "Trip dispatched",
    changedBy: userId
  });

  vehicle.status = VEHICLE_STATUSES.ON_TRIP;
  driver.status = DRIVER_STATUSES.ON_TRIP;

  await Promise.all([trip.save(), vehicle.save(), driver.save()]);
  return trip;
}

export async function completeTrip({ trip, vehicle, driver, userId }) {
  if (!trip) {
    throw createServiceError(404, "Trip not found");
  }

  if (trip.status !== TRIP_STATUSES.DISPATCHED) {
    throw createServiceError(400, "Only dispatched trips can be completed");
  }

  trip.status = TRIP_STATUSES.COMPLETED;
  trip.completedAt = new Date();
  trip.updatedBy = userId;
  trip.timeline.push({
    status: TRIP_STATUSES.COMPLETED,
    note: "Trip completed",
    changedBy: userId
  });

  if (vehicle && vehicle.status !== VEHICLE_STATUSES.RETIRED) {
    vehicle.status = VEHICLE_STATUSES.AVAILABLE;
    vehicle.odometer = Number(vehicle.odometer ?? 0) + Number(trip.distance ?? 0);
  }

  if (driver && driver.status !== DRIVER_STATUSES.SUSPENDED) {
    driver.status = DRIVER_STATUSES.AVAILABLE;
  }

  await Promise.all([trip.save(), vehicle?.save?.(), driver?.save?.()].filter(Boolean));
  return trip;
}

export async function cancelTrip({ trip, vehicle, driver, userId }) {
  if (!trip) {
    throw createServiceError(404, "Trip not found");
  }

  if ([TRIP_STATUSES.COMPLETED, TRIP_STATUSES.CANCELLED].includes(trip.status)) {
    throw createServiceError(400, `Cannot cancel a trip with status ${trip.status}`);
  }

  const wasDispatched = trip.status === TRIP_STATUSES.DISPATCHED;

  trip.status = TRIP_STATUSES.CANCELLED;
  trip.cancelledAt = new Date();
  trip.updatedBy = userId;
  trip.timeline.push({
    status: TRIP_STATUSES.CANCELLED,
    note: "Trip cancelled",
    changedBy: userId
  });

  if (wasDispatched && vehicle && vehicle.status !== VEHICLE_STATUSES.RETIRED) {
    vehicle.status = VEHICLE_STATUSES.AVAILABLE;
  }

  if (wasDispatched && driver && driver.status !== DRIVER_STATUSES.SUSPENDED) {
    driver.status = DRIVER_STATUSES.AVAILABLE;
  }

  await Promise.all([trip.save(), vehicle?.save?.(), driver?.save?.()].filter(Boolean));
  return trip;
}

export async function openMaintenance({ maintenance, vehicle, userId }) {
  if (!vehicle) {
    throw createServiceError(404, "Vehicle not found");
  }

  if (vehicle.status === VEHICLE_STATUSES.RETIRED) {
    throw createServiceError(400, "Retired vehicles cannot enter maintenance");
  }

  maintenance.status = MAINTENANCE_STATUSES.ACTIVE;
  maintenance.createdBy = userId;
  maintenance.updatedBy = userId;
  maintenance.history.push({
    status: MAINTENANCE_STATUSES.ACTIVE,
    note: "Maintenance opened",
    changedBy: userId
  });

  vehicle.status = VEHICLE_STATUSES.IN_SHOP;

  await Promise.all([maintenance.save(), vehicle.save()]);
  return maintenance;
}

export async function closeMaintenance({ maintenance, vehicle, userId }) {
  if (!maintenance) {
    throw createServiceError(404, "Maintenance record not found");
  }

  if (maintenance.status !== MAINTENANCE_STATUSES.ACTIVE) {
    throw createServiceError(400, "Only active maintenance can be closed");
  }

  maintenance.status = MAINTENANCE_STATUSES.COMPLETED;
  maintenance.closedAt = new Date();
  maintenance.updatedBy = userId;
  maintenance.history.push({
    status: MAINTENANCE_STATUSES.COMPLETED,
    note: "Maintenance closed",
    changedBy: userId
  });

  if (vehicle && vehicle.status !== VEHICLE_STATUSES.RETIRED) {
    vehicle.status = VEHICLE_STATUSES.AVAILABLE;
  }

  await Promise.all([maintenance.save(), vehicle?.save?.()].filter(Boolean));
  return maintenance;
}
