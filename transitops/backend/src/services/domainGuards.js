import mongoose from "mongoose";
import { Trip } from "../models/Trip.js";
import { Vehicle } from "../models/Vehicle.js";
import { badRequest, notFound } from "./serviceErrors.js";

export function assertValidObjectId(id, field = "id") {
  if (!mongoose.isValidObjectId(id)) {
    throw badRequest(`${field} must be a valid MongoDB ObjectId`, field);
  }
}

export async function assertVehicleExists(vehicleId) {
  assertValidObjectId(vehicleId, "vehicleId");
  const vehicle = await Vehicle.findById(vehicleId);

  if (!vehicle) {
    throw notFound("Vehicle not found");
  }

  return vehicle;
}

export async function assertTripExists(tripId) {
  if (!tripId) {
    return null;
  }

  assertValidObjectId(tripId, "tripId");
  const trip = await Trip.findById(tripId);

  if (!trip) {
    throw notFound("Trip not found");
  }

  return trip;
}
