import { getDriverComplianceCounts } from "../repositories/driverRepository.js";

export async function getDriverComplianceDashboard() {
  return getDriverComplianceCounts();
}

