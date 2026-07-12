function round(value, decimals = 2) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function calculateFuelEfficiency(distanceKm, fuelConsumedLiters) {
  if (!fuelConsumedLiters || fuelConsumedLiters <= 0) {
    return 0;
  }

  return round(distanceKm / fuelConsumedLiters);
}

export function calculateOperationalCost({ fuelCost = 0, maintenanceCost = 0, otherExpenses = 0 } = {}) {
  return round(fuelCost + maintenanceCost + otherExpenses);
}

export function calculateFleetUtilization(onTripVehicles, totalVehicles) {
  if (!totalVehicles || totalVehicles <= 0) {
    return 0;
  }

  return round((onTripVehicles / totalVehicles) * 100);
}

export function calculateRoi({ revenue = 0, fuelCost = 0, maintenanceCost = 0, otherExpenses = 0, acquisitionCost = 0 } = {}) {
  if (!acquisitionCost || acquisitionCost <= 0) {
    return 0;
  }

  return round(((revenue - fuelCost - maintenanceCost - otherExpenses) / acquisitionCost) * 100);
}
