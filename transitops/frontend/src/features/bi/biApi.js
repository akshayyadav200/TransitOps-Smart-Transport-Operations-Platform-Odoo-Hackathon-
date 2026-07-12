import { apiClient } from "../../lib/apiClient.js";
import { compactParams } from "./formatters.js";

export const analyticsApi = {
  summary: (params) => apiClient.get("/analytics/summary", { params: compactParams(params) })
};

export const fuelApi = {
  list: (params) => apiClient.get("/fuel", { params: compactParams(params) }),
  history: (params) => apiClient.get("/fuel/history", { params: compactParams(params) }),
  vehicleWise: (params) => apiClient.get("/fuel/vehicle-wise", { params: compactParams(params) }),
  tripWise: (params) => apiClient.get("/fuel/trip-wise", { params: compactParams(params) }),
  create: (payload) => apiClient.post("/fuel", payload),
  update: (id, payload) => apiClient.put(`/fuel/${id}`, payload),
  remove: (id) => apiClient.delete(`/fuel/${id}`)
};

export const expenseApi = {
  list: (params) => apiClient.get("/expenses", { params: compactParams(params) }),
  categories: (params) => apiClient.get("/expenses/categories", { params: compactParams(params) }),
  vehicleWise: (params) => apiClient.get("/expenses/vehicle-wise", { params: compactParams(params) }),
  create: (payload) => apiClient.post("/expenses", payload),
  update: (id, payload) => apiClient.put(`/expenses/${id}`, payload),
  remove: (id) => apiClient.delete(`/expenses/${id}`)
};

export const tripApi = {
  list: (params) => apiClient.get("/trips", { params: compactParams(params) })
};

export const reportApi = {
  filters: () => apiClient.get("/reports/filters"),
  report: (type, params) => apiClient.get(`/reports/${type}`, { params: compactParams(params) })
};
