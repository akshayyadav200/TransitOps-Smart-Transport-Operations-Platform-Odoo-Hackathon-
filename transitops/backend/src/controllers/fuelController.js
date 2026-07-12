import {
  addFuel,
  editFuel,
  getFuel,
  listFuel,
  listFuelHistory,
  listTripWiseFuel,
  listVehicleWiseFuel,
  removeFuel
} from "../services/fuelService.js";
import { successResponse } from "../utils/apiResponse.js";

export async function getFuelRecords(req, res, next) {
  try {
    const data = await listFuel(req.query);
    return successResponse(res, { message: "Fuel records fetched successfully", data });
  } catch (error) {
    return next(error);
  }
}

export async function getFuelRecordById(req, res, next) {
  try {
    const data = await getFuel(req.params.id);
    return successResponse(res, { message: "Fuel record fetched successfully", data });
  } catch (error) {
    return next(error);
  }
}

export async function createFuelRecord(req, res, next) {
  try {
    const data = await addFuel(req.body);
    return successResponse(res, { message: "Fuel record created successfully", data, statusCode: 201 });
  } catch (error) {
    return next(error);
  }
}

export async function updateFuelRecord(req, res, next) {
  try {
    const data = await editFuel(req.params.id, req.body);
    return successResponse(res, { message: "Fuel record updated successfully", data });
  } catch (error) {
    return next(error);
  }
}

export async function deleteFuelRecord(req, res, next) {
  try {
    const data = await removeFuel(req.params.id);
    return successResponse(res, { message: "Fuel record deleted successfully", data });
  } catch (error) {
    return next(error);
  }
}

export async function getFuelHistory(req, res, next) {
  try {
    const data = await listFuelHistory(req.query);
    return successResponse(res, { message: "Fuel history fetched successfully", data });
  } catch (error) {
    return next(error);
  }
}

export async function getVehicleWiseFuel(req, res, next) {
  try {
    const data = await listVehicleWiseFuel(req.query);
    return successResponse(res, { message: "Vehicle-wise fuel fetched successfully", data });
  } catch (error) {
    return next(error);
  }
}

export async function getTripWiseFuel(req, res, next) {
  try {
    const data = await listTripWiseFuel(req.query);
    return successResponse(res, { message: "Trip-wise fuel fetched successfully", data });
  } catch (error) {
    return next(error);
  }
}
