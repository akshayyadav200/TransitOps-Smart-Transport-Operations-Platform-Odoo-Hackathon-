import { apiClient } from "../../lib/apiClient.js";

export const vehicleApi = {
  list: (params) => apiClient.get("/vehicles", { params }),
  available: (params) => apiClient.get("/vehicles/available", { params }),
  create: (payload) => apiClient.post("/vehicles", payload),
  update: (id, payload) => apiClient.put(`/vehicles/${id}`, payload),
  remove: (id) => apiClient.delete(`/vehicles/${id}`),
  retire: (id) => apiClient.patch(`/vehicles/${id}/retire`)
};

export const driverApi = {
  list: (params) => apiClient.get("/drivers", { params }),
  available: (params) => apiClient.get("/drivers/available", { params }),
  create: (payload) => apiClient.post("/drivers", payload),
  update: (id, payload) => apiClient.put(`/drivers/${id}`, payload),
  remove: (id) => apiClient.delete(`/drivers/${id}`)
};

export const complianceApi = {
  drivers: () => apiClient.get("/compliance/drivers")
};

