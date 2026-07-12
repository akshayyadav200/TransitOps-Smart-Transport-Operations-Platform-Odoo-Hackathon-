function defaultApiBaseUrl() {
  if (typeof window === "undefined") {
    return "http://localhost:5000/api";
  }

  return `${window.location.protocol}//${window.location.hostname}:5000/api`;
}

export const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL ?? defaultApiBaseUrl();

export class ApiError extends Error {
  constructor({ errors = [], message = "Request failed", status = 500 } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

function notifyAuthExpired() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new window.CustomEvent("transitops:auth-expired"));
  }
}

async function parseResponse(response) {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      notifyAuthExpired();
    }

    throw new ApiError({
      errors: payload?.errors ?? [],
      message: payload?.message ?? (response.status === 403 ? "You do not have permission to perform this action" : "Request failed"),
      status: response.status
    });
  }

  return payload;
}

export async function apiRequest(path, options = {}) {
  const url = new URL(path.replace(/^\//, ""), `${API_BASE_URL}/`);

  let response;

  try {
    response = await fetch(url, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {})
      },
      ...options
    });
  } catch {
    throw new ApiError({
      message: "Network request failed. Check that the backend is running, then retry.",
      status: 0
    });
  }

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
