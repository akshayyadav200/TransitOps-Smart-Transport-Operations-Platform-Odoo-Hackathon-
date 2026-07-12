import { DRIVER_STATUSES } from "../constants/enums.js";
import {
  createDriver,
  deleteDriverById,
  findAvailableDrivers,
  findDriverById,
  findDriverByLicenseNumber,
  searchDrivers,
  startOfToday,
  updateDriverById
} from "../repositories/driverRepository.js";
import { validateDriverCreate, validateDriverUpdate } from "../validators/driverValidator.js";
import { conflict, notFound } from "./serviceErrors.js";

function isLicenseExpired(licenseExpiryDate) {
  const expiry = new Date(licenseExpiryDate);
  expiry.setHours(0, 0, 0, 0);
  return expiry < startOfToday();
}

function serializeDriver(driver) {
  const object = driver.toObject ? driver.toObject({ virtuals: true }) : driver;
  const licenseExpired = isLicenseExpired(object.licenseExpiryDate);

  return {
    ...object,
    licenseExpired,
    dispatchEligible: object.status === DRIVER_STATUSES.AVAILABLE && !licenseExpired
  };
}

async function assertUniqueLicenseNumber(licenseNumber, currentId = null) {
  const existing = await findDriverByLicenseNumber(licenseNumber);

  if (existing && String(existing._id) !== String(currentId)) {
    throw conflict("License number already exists", "licenseNumber");
  }
}

export async function listDrivers(query) {
  const result = await searchDrivers(query);
  return {
    ...result,
    items: result.items.map(serializeDriver)
  };
}

export async function getDriver(id) {
  const driver = await findDriverById(id);

  if (!driver) {
    throw notFound("Driver not found");
  }

  return serializeDriver(driver);
}

export async function addDriver(payload) {
  const data = validateDriverCreate(payload);
  await assertUniqueLicenseNumber(data.licenseNumber);
  const driver = await createDriver(data);

  return serializeDriver(driver);
}

export async function editDriver(id, payload) {
  const data = validateDriverUpdate(payload);

  if (data.licenseNumber) {
    await assertUniqueLicenseNumber(data.licenseNumber, id);
  }

  const driver = await updateDriverById(id, data);

  if (!driver) {
    throw notFound("Driver not found");
  }

  return serializeDriver(driver);
}

export async function removeDriver(id) {
  const driver = await deleteDriverById(id);

  if (!driver) {
    throw notFound("Driver not found");
  }

  return serializeDriver(driver);
}

export async function listAvailableDrivers(query) {
  const result = await findAvailableDrivers(query);
  return {
    ...result,
    items: result.items.map(serializeDriver)
  };
}

export async function assertDriverDispatchEligible(id) {
  const driver = await getDriver(id);

  if (!driver.dispatchEligible) {
    const reason = driver.licenseExpired ? "license is expired" : `status is ${driver.status}`;
    throw conflict(`Driver cannot be dispatched because ${reason}`, "status");
  }

  return driver;
}

