import { getAnalyticsSummary } from "../services/analyticsService.js";
import { successResponse } from "../utils/apiResponse.js";

export async function getSummary(req, res, next) {
  try {
    const data = await getAnalyticsSummary(req.query);
    return successResponse(res, { message: "Analytics summary fetched successfully", data });
  } catch (error) {
    return next(error);
  }
}
