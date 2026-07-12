import { findTripById, searchTrips } from "../repositories/tripRepository.js";
import { assertValidObjectId } from "./domainGuards.js";
import { notFound } from "./serviceErrors.js";
import { serializePage, toPlainObject } from "./serialization.js";

export async function listTrips(query) {
  const result = await searchTrips(query);
  return serializePage(result);
}

export async function getTrip(id) {
  assertValidObjectId(id);
  const trip = await findTripById(id);

  if (!trip) {
    throw notFound("Trip not found");
  }

  return toPlainObject(trip);
}
