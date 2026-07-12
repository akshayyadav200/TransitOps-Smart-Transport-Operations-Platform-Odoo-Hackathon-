export function createValidationError(errors) {
  const error = new Error("Validation failed");
  error.statusCode = 400;
  error.errors = errors;
  return error;
}

export function assertNoValidationErrors(errors) {
  if (errors.length > 0) {
    throw createValidationError(errors);
  }
}

export function requiredString(value, field, errors) {
  if (typeof value !== "string" || value.trim().length === 0) {
    errors.push({ field, message: `${field} is required` });
    return null;
  }

  return value.trim();
}

export function optionalString(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return String(value).trim();
}

export function optionalTrimmedString(value) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return String(value).trim();
}

export function requiredNumber(value, field, errors) {
  const numberValue = Number(value);

  if (value === undefined || value === null || Number.isNaN(numberValue)) {
    errors.push({ field, message: `${field} must be a valid number` });
    return null;
  }

  return numberValue;
}

export function optionalNumber(value, field, errors) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    errors.push({ field, message: `${field} must be a valid number` });
    return undefined;
  }

  return numberValue;
}

export function requiredDate(value, field, errors) {
  const dateValue = new Date(value);

  if (!value || Number.isNaN(dateValue.getTime())) {
    errors.push({ field, message: `${field} must be a valid date` });
    return null;
  }

  return dateValue;
}

export function optionalDate(value, field, errors) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const dateValue = new Date(value);

  if (Number.isNaN(dateValue.getTime())) {
    errors.push({ field, message: `${field} must be a valid date` });
    return undefined;
  }

  return dateValue;
}

export function enumValue(value, field, allowedValues, errors) {
  if (!allowedValues.includes(value)) {
    errors.push({ field, message: `${field} must be one of: ${allowedValues.join(", ")}` });
    return null;
  }

  return value;
}

export function optionalEnumValue(value, field, allowedValues, errors) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return enumValue(value, field, allowedValues, errors);
}

export function requiredObjectId(value, field, errors) {
  if (typeof value !== "string" || !/^[a-f\d]{24}$/i.test(value.trim())) {
    errors.push({ field, message: `${field} must be a valid MongoDB ObjectId` });
    return null;
  }

  return value.trim();
}

export function optionalObjectId(value, field, errors) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return requiredObjectId(value, field, errors);
}
