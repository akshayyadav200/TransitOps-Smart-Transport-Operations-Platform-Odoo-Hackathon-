const Trip = require('../../models/Trip');
const Vehicle = require('../../models/Vehicle');
const odooAdapter = require('../adapters/odooAdapter');

/**
 * Calculates operational metrics, financial stats, and cargo distribution.
 */
exports.getFleetAnalytics = async (req, res) => {
  try {
    // 1. Fetch all trip records and populate vehicle information
    const trips = await Trip.find({}).populate('vehicle');

    // Initial Dashboard Accumulators
    let totalRevenue = 0;
    let activeRevenue = 0;
    let activeTripsCount = 0;
    let completedTripsCount = 0;
    
    let totalDistance = 0;
    let totalFuelUsed = 0;

    // Weight distribution counters by status
    const cargoDistribution = {
      'Draft': 0,
      'Pending Dispatch': 0,
      'Dispatched': 0,
      'Completed': 0,
      'Cancelled': 0
    };

    // Capacity utilization tracking
    let utilizedCapacitySum = 0;
    let totalAssignedCapacitySum = 0;

    trips.forEach(trip => {
      // Accumulate revenue (exclude Cancelled trips from expected revenue calculations)
      if (trip.status !== 'Cancelled') {
        totalRevenue += trip.revenue || 0;
      }
      
      if (trip.status === 'Dispatched') {
        activeRevenue += trip.revenue || 0;
        activeTripsCount++;
      } else if (trip.status === 'Completed') {
        completedTripsCount++;
      }

      // Track distance and fuel for active & completed runs
      if (trip.status === 'Dispatched' || trip.status === 'Completed') {
        totalDistance += trip.distance || 0;
        totalFuelUsed += trip.fuel || 0;
      }

      // Distribute Cargo Weight
      if (cargoDistribution[trip.status] !== undefined) {
        cargoDistribution[trip.status] += trip.cargoWeight || 0;
      }

      // Calculate capacity utilization details if vehicle is assigned
      if ((trip.status === 'Dispatched' || trip.status === 'Completed') && trip.vehicle) {
        utilizedCapacitySum += trip.cargoWeight || 0;
        totalAssignedCapacitySum += trip.vehicle.maxCapacity || 0;
      }
    });

    // 2. Compute Efficiency Metrics
    const capacityUtilizationRate = totalAssignedCapacitySum > 0 
      ? Number(((utilizedCapacitySum / totalAssignedCapacitySum) * 100).toFixed(2))
      : 0;

    // Calculate Fuel Consumption Rate (Liters per 100 km)
    const averageFuelConsumptionRate = totalDistance > 0 
      ? Number(((totalFuelUsed / totalDistance) * 100).toFixed(2)) 
      : 0;

    // Calculate Average Trip Profitability (Revenue per km)
    const revenuePerKm = totalDistance > 0 
      ? Number((totalRevenue / totalDistance).toFixed(2)) 
      : 0;

    return res.status(200).json({
      summary: {
        totalTripsCount: trips.length,
        activeTripsCount,
        completedTripsCount,
        totalExpectedRevenue: totalRevenue,
        activeRevenueValue: activeRevenue
      },
      efficiencyMetrics: {
        capacityUtilizationPercentage: capacityUtilizationRate,
        fuelConsumptionRateLitersPer100Km: averageFuelConsumptionRate,
        revenuePerKm: revenuePerKm,
        totalDistanceKm: totalDistance,
        totalFuelLiters: totalFuelUsed
      },
      cargoWeightDistribution: {
        byStatus: cargoDistribution,
        totalPayloadCarriedKg: utilizedCapacitySum + cargoDistribution['Pending Dispatch']
      }
    });
  } catch (error) {
    console.error("Error aggregating fleet analytics:", error);
    return res.status(500).json({ message: "Analytics computation failed.", error: error.message });
  }
};

/**
 * Triggers batch synchronisation of verified trips (Pending Dispatch status) with the Odoo ERP mock adapter.
 */
exports.syncPendingTripsToOdoo = async (req, res) => {
  try {
    const pendingTrips = await Trip.find({ status: 'Pending Dispatch' });

    if (pendingTrips.length === 0) {
      return res.status(200).json({
        message: "No trips currently marked 'Pending Dispatch'. Nothing to sync.",
        syncReceipts: []
      });
    }

    const syncReceipts = [];
    for (const trip of pendingTrips) {
      const receipt = await odooAdapter.syncTripToOdoo(trip);
      syncReceipts.push({
        tripId: trip._id,
        tripNumber: trip.tripNumber,
        odooRecordId: receipt.odoo_record_id,
        odooExternalRef: receipt.odoo_external_ref,
        timestamp: receipt.synced_at
      });
    }

    return res.status(200).json({
      message: `Batch sync complete. Successfully synchronized ${pendingTrips.length} trips with Odoo ERP.`,
      syncReceipts
    });
  } catch (error) {
    console.error("Error during Odoo batch sync:", error);
    return res.status(500).json({ message: "Odoo synchronization failed.", error: error.message });
  }
};
