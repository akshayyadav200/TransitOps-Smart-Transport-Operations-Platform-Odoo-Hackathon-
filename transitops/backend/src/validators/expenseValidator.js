import { expenseCategoryValues } from "../constants/enums.js";
import {
  assertNoValidationErrors,
  enumValue,
  optionalObjectId,
  optionalString,
  requiredDate,
  requiredNumber,
  requiredObjectId,
  requiredString
} from "./validationUtils.js";

function normalizeExpensePayload(payload, { partial = false } = {}) {
  const errors = [];
  const normalized = {};

  if (!partial || payload.vehicleId !== undefined) {
    normalized.vehicleId = requiredObjectId(payload.vehicleId, "vehicleId", errors);
  }

  if (payload.tripId !== undefined) {
    normalized.tripId = optionalObjectId(payload.tripId, "tripId", errors);
  }

  if (!partial || payload.category !== undefined) {
    normalized.category = enumValue(payload.category, "category", expenseCategoryValues, errors);
  }

  if (!partial || payload.amount !== undefined) {
    const amount = requiredNumber(payload.amount, "amount", errors);
    if (amount !== null) {
      if (amount <= 0) {
        errors.push({ field: "amount", message: "amount must be greater than zero" });
      }
      normalized.amount = amount;
    }
  }

  if (payload.description !== undefined) {
    normalized.description = optionalString(payload.description);
  }

  if (!partial || payload.date !== undefined) {
    normalized.date = requiredDate(payload.date, "date", errors);
  }

  if (!partial || payload.createdBy !== undefined) {
    normalized.createdBy = requiredString(payload.createdBy, "createdBy", errors);
  }

  assertNoValidationErrors(errors);
  return normalized;
}

export function validateExpenseCreate(payload) {
  return normalizeExpensePayload(payload);
}

export function validateExpenseUpdate(payload) {
  return normalizeExpensePayload(payload, { partial: true });
}
