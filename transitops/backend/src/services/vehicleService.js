import { VEHICLE_STATUSES } from "../constants/enums.js";
import {
  createVehicle,
  deleteVehicleById,
  findAvailableVehicles,
  findVehicleById,
  findVehicleByRegistrationNumber,
  searchVehicles,
  updateVehicleById
} from "../repositories/vehicleRepository.js";
import { validateVehicleCreate, validateVehicleUpdate } from "../validators/vehicleValidator.js";
import { conflict, notFound } from "./serviceErrors.js";

function serializeVehicle(vehicle) {
  const object = vehicle.toObject ? vehicle.toObject({ virtuals: true }) : vehicle;

  return {
    ...object,
    dispatchEligible: object.status === VEHICLE_STATUSES.AVAILABLE
  };
}

async function assertUniqueRegistrationNumber(registrationNumber, currentId = null) {
  const existing = await findVehicleByRegistrationNumber(registrationNumber);

  if (existing && String(existing._id) !== String(currentId)) {
    throw conflict("Registration number already exists", "registrationNumber");
  }
}

export async function listVehicles(query) {
  const result = await searchVehicles(query);
  return {
    ...result,
    items: result.items.map(serializeVehicle)
  };
}

export async function getVehicle(id) {
  const vehicle = await findVehicleById(id);

  if (!vehicle) {
    throw notFound("Vehicle not found");
  }

  return serializeVehicle(vehicle);
}

export async function addVehicle(payload) {
  const data = validateVehicleCreate(payload);
  await assertUniqueRegistrationNumber(data.registrationNumber);
  const vehicle = await createVehicle(data);

  return serializeVehicle(vehicle);
}

export async function editVehicle(id, payload) {
  const data = validateVehicleUpdate(payload);

  if (data.registrationNumber) {
    await assertUniqueRegistrationNumber(data.registrationNumber, id);
  }

  const vehicle = await updateVehicleById(id, data);

  if (!vehicle) {
    throw notFound("Vehicle not found");
  }

  return serializeVehicle(vehicle);
}

export async function removeVehicle(id) {
  const vehicle = await deleteVehicleById(id);

  if (!vehicle) {
    throw notFound("Vehicle not found");
  }

  return serializeVehicle(vehicle);
}

export async function retireVehicle(id) {
  const vehicle = await updateVehicleById(id, {
    status: VEHICLE_STATUSES.RETIRED,
    retiredAt: new Date()
  });

  if (!vehicle) {
    throw notFound("Vehicle not found");
  }

  return serializeVehicle(vehicle);
}

export async function listAvailableVehicles(query) {
  const result = await findAvailableVehicles(query);
  return {
    ...result,
    items: result.items.map(serializeVehicle)
  };
}

export async function assertVehicleDispatchEligible(id) {
  const vehicle = await getVehicle(id);

  if (!vehicle.dispatchEligible) {
    throw conflict(`Vehicle cannot be dispatched while status is ${vehicle.status}`, "status");
  }

  return vehicle;
}

