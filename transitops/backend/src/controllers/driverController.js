import {
  addDriver,
  editDriver,
  getDriver,
  listAvailableDrivers,
  listDrivers,
  removeDriver
} from "../services/driverService.js";
import { successResponse } from "../utils/apiResponse.js";

export async function getDrivers(req, res, next) {
  try {
    const data = await listDrivers(req.query);
    return successResponse(res, { message: "Drivers fetched successfully", data });
  } catch (error) {
    return next(error);
  }
}

export async function getAvailableDrivers(req, res, next) {
  try {
    const data = await listAvailableDrivers(req.query);
    return successResponse(res, { message: "Available drivers fetched successfully", data });
  } catch (error) {
    return next(error);
  }
}

export async function getDriverById(req, res, next) {
  try {
    const data = await getDriver(req.params.id);
    return successResponse(res, { message: "Driver fetched successfully", data });
  } catch (error) {
    return next(error);
  }
}

export async function createDriver(req, res, next) {
  try {
    const data = await addDriver(req.body);
    return successResponse(res, { message: "Driver created successfully", data, statusCode: 201 });
  } catch (error) {
    return next(error);
  }
}

export async function updateDriver(req, res, next) {
  try {
    const data = await editDriver(req.params.id, req.body);
    return successResponse(res, { message: "Driver updated successfully", data });
  } catch (error) {
    return next(error);
  }
}

export async function deleteDriver(req, res, next) {
  try {
    const data = await removeDriver(req.params.id);
    return successResponse(res, { message: "Driver deleted successfully", data });
  } catch (error) {
    return next(error);
  }
}

