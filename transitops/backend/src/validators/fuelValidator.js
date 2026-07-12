import { fuelTypeValues, FUEL_TYPES } from "../constants/enums.js";
import {
  assertNoValidationErrors,
  enumValue,
  optionalObjectId,
  requiredDate,
  requiredNumber,
  requiredObjectId,
  requiredString
} from "./validationUtils.js";

function normalizeFuelPayload(payload, { partial = false } = {}) {
  const errors = [];
  const normalized = {};

  if (!partial || payload.vehicleId !== undefined) {
    normalized.vehicleId = requiredObjectId(payload.vehicleId, "vehicleId", errors);
  }

  if (payload.tripId !== undefined) {
    normalized.tripId = optionalObjectId(payload.tripId, "tripId", errors);
  }

  if (!partial || payload.liters !== undefined) {
    const liters = requiredNumber(payload.liters, "liters", errors);
    if (liters !== null) {
      if (liters <= 0) {
        errors.push({ field: "liters", message: "liters must be greater than zero" });
      }
      normalized.liters = liters;
    }
  }

  if (!partial || payload.cost !== undefined) {
    const cost = requiredNumber(payload.cost, "cost", errors);
    if (cost !== null) {
      if (cost <= 0) {
        errors.push({ field: "cost", message: "cost must be greater than zero" });
      }
      normalized.cost = cost;
    }
  }

  if (!partial || payload.fuelType !== undefined) {
    normalized.fuelType = enumValue(payload.fuelType ?? FUEL_TYPES.DIESEL, "fuelType", fuelTypeValues, errors);
  }

  if (!partial || payload.date !== undefined) {
    normalized.date = requiredDate(payload.date, "date", errors);
  }

  if (!partial || payload.odometer !== undefined) {
    const odometer = requiredNumber(payload.odometer, "odometer", errors);
    if (odometer !== null) {
      if (odometer < 0) {
        errors.push({ field: "odometer", message: "odometer cannot be negative" });
      }
      normalized.odometer = odometer;
    }
  }

  if (!partial || payload.filledBy !== undefined) {
    normalized.filledBy = requiredString(payload.filledBy, "filledBy", errors);
  }

  assertNoValidationErrors(errors);
  return normalized;
}

export function validateFuelCreate(payload) {
  return normalizeFuelPayload(payload);
}

export function validateFuelUpdate(payload) {
  return normalizeFuelPayload(payload, { partial: true });
}
