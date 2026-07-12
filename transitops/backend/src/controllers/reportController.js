import {
  getCostReport,
  getExpenseReport,
  getFuelReport,
  getReportFilterOptions,
  getRoiReport,
  getTripReport,
  getVehicleReport
} from "../services/reportService.js";
import { successResponse } from "../utils/apiResponse.js";

const REPORT_HANDLERS = {
  vehicles: getVehicleReport,
  trips: getTripReport,
  fuel: getFuelReport,
  expenses: getExpenseReport,
  costs: getCostReport,
  roi: getRoiReport
};

export function reportHandler(type) {
  return async function getReport(req, res, next) {
    try {
      const data = await REPORT_HANDLERS[type](req.query);
      return successResponse(res, { message: `${type} report fetched successfully`, data });
    } catch (error) {
      return next(error);
    }
  };
}

export async function getFilters(req, res, next) {
  try {
    const data = await getReportFilterOptions();
    return successResponse(res, { message: "Report filters fetched successfully", data });
  } catch (error) {
    return next(error);
  }
}
