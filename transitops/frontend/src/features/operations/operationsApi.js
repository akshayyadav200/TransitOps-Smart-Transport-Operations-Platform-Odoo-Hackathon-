import { apiClient } from "../../lib/apiClient.js";

export async function fetchTrips() {
  const payload = await apiClient.get("/trips");
  return payload.data.trips ?? [];
}

export async function fetchDispatchOptions() {
  const payload = await apiClient.get("/trips/dispatch-options");
  return payload.data;
}

export async function createTrip(body) {
  const payload = await apiClient.post("/trips", body);
  return payload.data.trip;
}

export async function dispatchTrip(id) {
  const payload = await apiClient.patch(`/trips/${id}/dispatch`, {});
  return payload.data.trip;
}

export async function completeTrip(id) {
  const payload = await apiClient.patch(`/trips/${id}/complete`, {});
  return payload.data.trip;
}

export async function cancelTrip(id) {
  const payload = await apiClient.patch(`/trips/${id}/cancel`, {});
  return payload.data.trip;
}

export async function fetchMaintenanceRecords() {
  const payload = await apiClient.get("/maintenance");
  return payload.data.maintenanceRecords ?? [];
}

export async function createMaintenance(body) {
  const payload = await apiClient.post("/maintenance", body);
  return payload.data.maintenance;
}

export async function closeMaintenance(id) {
  const payload = await apiClient.patch(`/maintenance/${id}/close`, {});
  return payload.data.maintenance;
}
