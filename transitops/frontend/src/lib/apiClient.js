export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

async function parseResponse(response) {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message ?? "Request failed";
    throw new Error(message);
  }

  return payload;
}

export async function apiRequest(path, options = {}) {
  const url = new URL(path.replace(/^\//, ""), `${API_BASE_URL}/`);

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
  delete: (path, options) => apiRequest(path, { ...options, method: "DELETE" })
};
