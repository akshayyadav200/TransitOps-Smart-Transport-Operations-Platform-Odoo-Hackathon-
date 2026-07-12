import { getTrip, listTrips } from "../services/tripService.js";
import { successResponse } from "../utils/apiResponse.js";

export async function getTrips(req, res, next) {
  try {
    const data = await listTrips(req.query);
    return successResponse(res, { message: "Trips fetched successfully", data });
  } catch (error) {
    return next(error);
  }
}

export async function getTripById(req, res, next) {
  try {
    const data = await getTrip(req.params.id);
    return successResponse(res, { message: "Trip fetched successfully", data });
  } catch (error) {
    return next(error);
  }
}
