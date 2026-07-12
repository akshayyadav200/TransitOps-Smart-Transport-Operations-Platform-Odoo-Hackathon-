import { driverStatusValues, DRIVER_STATUSES, licenseCategoryValues } from "../constants/enums.js";
import {
  assertNoValidationErrors,
  enumValue,
  optionalString,
  requiredDate,
  requiredNumber,
  requiredString
} from "./validationUtils.js";

const CONTACT_PATTERN = /^[0-9+\-\s()]{7,20}$/;

function normalizeDriverPayload(payload, { partial = false } = {}) {
  const errors = [];
  const normalized = {};

  if (!partial || payload.name !== undefined) {
    normalized.name = requiredString(payload.name, "name", errors);
  }

  if (!partial || payload.licenseNumber !== undefined) {
    const licenseNumber = requiredString(payload.licenseNumber, "licenseNumber", errors);
    if (licenseNumber) {
      normalized.licenseNumber = licenseNumber.toUpperCase();
    }
  }

  if (!partial || payload.licenseCategory !== undefined) {
    normalized.licenseCategory = enumValue(payload.licenseCategory, "licenseCategory", licenseCategoryValues, errors);
  }

  if (!partial || payload.licenseExpiryDate !== undefined) {
    normalized.licenseExpiryDate = requiredDate(payload.licenseExpiryDate, "licenseExpiryDate", errors);
  }

  if (!partial || payload.contactNumber !== undefined) {
    const contactNumber = requiredString(payload.contactNumber, "contactNumber", errors);
    if (contactNumber && !CONTACT_PATTERN.test(contactNumber)) {
      errors.push({ field: "contactNumber", message: "contactNumber must be a valid phone number" });
    }
    normalized.contactNumber = contactNumber;
  }

  if (!partial || payload.safetyScore !== undefined) {
    const safetyScore = requiredNumber(payload.safetyScore ?? 100, "safetyScore", errors);
    if (safetyScore !== null) {
      if (safetyScore < 0 || safetyScore > 100) {
        errors.push({ field: "safetyScore", message: "safetyScore must be between 0 and 100" });
      }
      normalized.safetyScore = safetyScore;
    }
  }

  if (payload.region !== undefined) {
    normalized.region = optionalString(payload.region);
  }

  if (!partial || payload.status !== undefined) {
    normalized.status = enumValue(payload.status ?? DRIVER_STATUSES.AVAILABLE, "status", driverStatusValues, errors);
  }

  assertNoValidationErrors(errors);
  return normalized;
}

export function validateDriverCreate(payload) {
  return normalizeDriverPayload(payload);
}

export function validateDriverUpdate(payload) {
  return normalizeDriverPayload(payload, { partial: true });
}

