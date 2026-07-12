export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001/api";

function buildUrl(path, params) {
  const url = new URL(path.replace(/^\//, ""), `${API_BASE_URL}/`);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return url;
}

async function parseResponse(response) {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message ?? "Request failed";
    const error = new Error(message);
    error.errors = payload?.errors ?? [];
    throw error;
  }

  return payload;
}

export async function apiRequest(path, options = {}) {
  const url = buildUrl(path, options.params);

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {})
    },
    ...options
  });

  return parseResponse(response);
}

export const apiClient = {
  get: (path, options) => apiRequest(path, { ...options, method: "GET" }),
  post: (path, body, options) =>
    apiRequest(path, {
      ...options,
      method: "POST",
      body: JSON.stringify(body)
    }),
  put: (path, body, options) =>
    apiRequest(path, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body)
    }),
  patch: (path, body, options) =>
    apiRequest(path, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body ?? {})
    }),
  delete: (path, options) => apiRequest(path, { ...options, method: "DELETE" })
};
