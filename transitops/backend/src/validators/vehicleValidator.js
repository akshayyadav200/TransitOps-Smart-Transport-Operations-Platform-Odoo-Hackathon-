import { vehicleStatusValues, vehicleTypeValues, VEHICLE_STATUSES } from "../constants/enums.js";
import {
  assertNoValidationErrors,
  enumValue,
  optionalNumber,
  optionalString,
  requiredNumber,
  requiredString
} from "./validationUtils.js";

function normalizeVehiclePayload(payload, { partial = false } = {}) {
  const errors = [];
  const normalized = {};

  if (!partial || payload.registrationNumber !== undefined) {
    const registrationNumber = requiredString(payload.registrationNumber, "registrationNumber", errors);
    if (registrationNumber) {
      normalized.registrationNumber = registrationNumber.toUpperCase();
    }
  }

  if (!partial || payload.name !== undefined) {
    normalized.name = requiredString(payload.name, "name", errors);
  }

  if (payload.model !== undefined) {
    normalized.model = optionalString(payload.model);
  }

  if (!partial || payload.type !== undefined) {
    normalized.type = enumValue(payload.type, "type", vehicleTypeValues, errors);
  }

  if (!partial || payload.maximumLoadCapacity !== undefined) {
    const maximumLoadCapacity = requiredNumber(payload.maximumLoadCapacity, "maximumLoadCapacity", errors);
    if (maximumLoadCapacity !== null) {
      if (maximumLoadCapacity <= 0) {
        errors.push({ field: "maximumLoadCapacity", message: "maximumLoadCapacity must be greater than zero" });
      }
      normalized.maximumLoadCapacity = maximumLoadCapacity;
    }
  }

  if (!partial || payload.odometer !== undefined) {
    const odometer = requiredNumber(payload.odometer ?? 0, "odometer", errors);
    if (odometer !== null) {
      if (odometer < 0) {
        errors.push({ field: "odometer", message: "odometer cannot be negative" });
      }
      normalized.odometer = odometer;
    }
  }

  if (payload.acquisitionCost !== undefined) {
    const acquisitionCost = optionalNumber(payload.acquisitionCost, "acquisitionCost", errors);
    if (acquisitionCost !== undefined) {
      if (acquisitionCost < 0) {
        errors.push({ field: "acquisitionCost", message: "acquisitionCost cannot be negative" });
      }
      normalized.acquisitionCost = acquisitionCost;
    }
  }

  if (payload.region !== undefined) {
    normalized.region = optionalString(payload.region);
  }

  if (!partial || payload.status !== undefined) {
    normalized.status = enumValue(payload.status ?? VEHICLE_STATUSES.AVAILABLE, "status", vehicleStatusValues, errors);
  }

  assertNoValidationErrors(errors);
  return normalized;
}

export function validateVehicleCreate(payload) {
  return normalizeVehiclePayload(payload);
}

export function validateVehicleUpdate(payload) {
  return normalizeVehiclePayload(payload, { partial: true });
}

