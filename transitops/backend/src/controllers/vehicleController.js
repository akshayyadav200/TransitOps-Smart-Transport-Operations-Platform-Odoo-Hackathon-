import {
  addVehicle,
  editVehicle,
  getVehicle,
  listAvailableVehicles,
  listVehicles,
  removeVehicle,
  retireVehicle
} from "../services/vehicleService.js";
import { successResponse } from "../utils/apiResponse.js";

export async function getVehicles(req, res, next) {
  try {
    const data = await listVehicles(req.query);
    return successResponse(res, { message: "Vehicles fetched successfully", data });
  } catch (error) {
    return next(error);
  }
}

export async function getAvailableVehicles(req, res, next) {
  try {
    const data = await listAvailableVehicles(req.query);
    return successResponse(res, { message: "Available vehicles fetched successfully", data });
  } catch (error) {
    return next(error);
  }
}

export async function getVehicleById(req, res, next) {
  try {
    const data = await getVehicle(req.params.id);
    return successResponse(res, { message: "Vehicle fetched successfully", data });
  } catch (error) {
    return next(error);
  }
}

export async function createVehicle(req, res, next) {
  try {
    const data = await addVehicle(req.body);
    return successResponse(res, { message: "Vehicle created successfully", data, statusCode: 201 });
  } catch (error) {
    return next(error);
  }
}

export async function updateVehicle(req, res, next) {
  try {
    const data = await editVehicle(req.params.id, req.body);
    return successResponse(res, { message: "Vehicle updated successfully", data });
  } catch (error) {
    return next(error);
  }
}

export async function deleteVehicle(req, res, next) {
  try {
    const data = await removeVehicle(req.params.id);
    return successResponse(res, { message: "Vehicle deleted successfully", data });
  } catch (error) {
    return next(error);
  }
}

export async function patchRetireVehicle(req, res, next) {
  try {
    const data = await retireVehicle(req.params.id);
    return successResponse(res, { message: "Vehicle retired successfully", data });
  } catch (error) {
    return next(error);
  }
}

