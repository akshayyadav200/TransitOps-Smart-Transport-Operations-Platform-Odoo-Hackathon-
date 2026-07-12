import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

function normalizeError(error) {
  const payload = error.response?.data;
  const normalized = new Error(payload?.message ?? error.message ?? "Request failed");
  normalized.errors = payload?.errors ?? [];
  normalized.statusCode = error.response?.status;
  return normalized;
}

export async function apiRequest(path, options = {}) {
  try {
    const response = await http.request({ url: path, ...options });
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export const apiClient = {
  get: (path, options) => apiRequest(path, { ...options, method: "GET" }),
  post: (path, data, options) =>
    apiRequest(path, {
      ...options,
      method: "POST",
      data
    }),
  put: (path, data, options) =>
    apiRequest(path, {
      ...options,
      method: "PUT",
      data
    }),
  patch: (path, data, options) =>
    apiRequest(path, {
      ...options,
      method: "PATCH",
      data: data ?? {}
    }),
  delete: (path, options) => apiRequest(path, { ...options, method: "DELETE" })
};
