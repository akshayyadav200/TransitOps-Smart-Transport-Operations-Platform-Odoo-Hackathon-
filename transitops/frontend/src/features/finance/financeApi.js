import { apiClient, API_BASE_URL } from "../../lib/apiClient.js";

function queryString(params = {}) {
  const entries = [];
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      entries.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  }
  return entries.join("&");
}

export const financeApi = {
  dashboard: (params) => apiClient.get("/finance/dashboard", { params }),
  reports: (params) => apiClient.get("/finance/reports", { params }),
  reportExportUrl: (params) => `${API_BASE_URL}/finance/reports/export?${queryString(params)}`,
  fuel: {
    list: (params) => apiClient.get("/finance/fuel", { params }),
    create: (payload) => apiClient.post("/finance/fuel", payload),
    update: (id, payload) => apiClient.put(`/finance/fuel/${id}`, payload),
    remove: (id) => apiClient.delete(`/finance/fuel/${id}`)
  },
  expenses: {
    list: (params) => apiClient.get("/finance/expenses", { params }),
    create: (payload) => apiClient.post("/finance/expenses", payload),
    update: (id, payload) => apiClient.put(`/finance/expenses/${id}`, payload),
    remove: (id) => apiClient.delete(`/finance/expenses/${id}`)
  }
};
