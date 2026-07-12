import {
  createFuel,
  deleteFuelById,
  findFuelById,
  getTripWiseFuel,
  getVehicleWiseFuel,
  searchFuel,
  updateFuelById
} from "../repositories/fuelRepository.js";
import { validateFuelCreate, validateFuelUpdate } from "../validators/fuelValidator.js";
import { assertTripExists, assertValidObjectId, assertVehicleExists } from "./domainGuards.js";
import { notFound } from "./serviceErrors.js";
import { serializePage, toPlainObject } from "./serialization.js";

async function assertFuelReferences(data) {
  if (data.vehicleId) {
    await assertVehicleExists(data.vehicleId);
  }

  if (data.tripId) {
    await assertTripExists(data.tripId);
  }
}

export async function listFuel(query) {
  const result = await searchFuel(query);
  return serializePage(result);
}

export async function getFuel(id) {
  assertValidObjectId(id);
  const fuel = await findFuelById(id);

  if (!fuel) {
    throw notFound("Fuel record not found");
  }

  return toPlainObject(fuel);
}

export async function addFuel(payload) {
  const data = validateFuelCreate(payload);
  await assertFuelReferences(data);
  const fuel = await createFuel(data);

  return toPlainObject(fuel);
}

export async function editFuel(id, payload) {
  assertValidObjectId(id);
  const data = validateFuelUpdate(payload);
  await assertFuelReferences(data);
  const fuel = await updateFuelById(id, data);

  if (!fuel) {
    throw notFound("Fuel record not found");
  }

  return toPlainObject(fuel);
}

export async function removeFuel(id) {
  assertValidObjectId(id);
  const fuel = await deleteFuelById(id);

  if (!fuel) {
    throw notFound("Fuel record not found");
  }

  return toPlainObject(fuel);
}

export async function listFuelHistory(query) {
  const result = await searchFuel({ ...query, sort: query.sort ?? "-date" });
  return serializePage(result);
}

export async function listVehicleWiseFuel(query) {
  return getVehicleWiseFuel(query);
}

export async function listTripWiseFuel(query) {
  return getTripWiseFuel(query);
}
