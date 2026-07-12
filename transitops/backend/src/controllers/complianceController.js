import { getDriverComplianceDashboard } from "../services/complianceService.js";
import { successResponse } from "../utils/apiResponse.js";

export async function getDriverCompliance(req, res, next) {
  try {
    const data = await getDriverComplianceDashboard();
    return successResponse(res, { message: "Driver compliance dashboard fetched successfully", data });
  } catch (error) {
    return next(error);
  }
}

