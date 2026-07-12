const Trip = require('../../models/Trip');
const Vehicle = require('../../models/Vehicle');
const Driver = require('../../models/Driver');

/**
 * Validates and creates/schedules a trip.
 * Enforces:
 * 1. Cargo weight <= vehicle capacity.
 * 2. Revenue > Distance * Fuel factor (calculated fuel operational cost).
 * 3. Driver must not be Suspended or Expired.
 * 4. Vehicle must not be In Shop or Retired.
 * Sets status to 'Pending Dispatch' upon successful validation.
 */
exports.createAndValidateTrip = async (req, res) => {
  try {
    const {
      tripNumber,
      source,
      destination,
      cargoWeight,
      distance,
      revenue,
      fuel,
      vehicle: vehicleId,
      driver: driverId
    } = req.body;

    // 1. Initial Mongoose validations and retrieval
    let vehicle = null;
    let driver = null;

    if (vehicleId) {
      vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle asset not found." });
      }

      // Check vehicle availability rules
      if (vehicle.status === 'In Shop' || vehicle.status === 'Retired') {
        return res.status(400).json({
          message: `Vehicle ${vehicle.plateNumber} is currently restricted (${vehicle.status}) and cannot be dispatched.`
        });
      }

      // Check weight capacity rule
      if (Number(cargoWeight) > vehicle.maxCapacity) {
        return res.status(400).json({
          message: `Operational overload: Cargo weight (${cargoWeight} kg) exceeds vehicle max capacity (${vehicle.maxCapacity} kg).`
        });
      }
    }

    if (driverId) {
      driver = await Driver.findById(driverId);
      if (!driver) {
        return res.status(404).json({ message: "Driver asset not found." });
      }

      // Check driver eligibility rules
      if (driver.status === 'Suspended' || driver.status === 'Expired') {
        return res.status(400).json({
          message: `Driver eligibility failure: ${driver.name} is currently ${driver.status} and cannot be assigned.`
        });
      }
    }

    // 2. Financial Registry check: Revenue > operational fuel cost (Distance * Fuel Allocated factor)
    const fuelOperationalCost = Number(distance || 0) * Number(fuel || 0);
    if (Number(revenue || 0) <= fuelOperationalCost) {
      return res.status(400).json({
        message: `Financial verification failure: Expected Revenue ($${revenue}) must be strictly greater than the calculated fuel operational cost ($${fuelOperationalCost}).`
      });
    }

    // 3. Automation: Save with 'Pending Dispatch' status (initial valid state)
    const newTrip = new Trip({
      tripNumber,
      source,
      destination,
      cargoWeight,
      distance,
      revenue,
      fuel,
      vehicle: vehicleId || null,
      driver: driverId || null,
      status: 'Pending Dispatch'
    });

    await newTrip.save();
    return res.status(201).json(newTrip);
  } catch (error) {
    console.error("Error creating trip:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate Trip reference identifier." });
    }
    return res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

/**
 * Dispatch a trip: Transitions states of Vehicle & Driver to 'On Trip' and Trip status to 'Dispatched'.
 */
exports.dispatchTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found." });
    }

    if (trip.status !== 'Draft' && trip.status !== 'Pending Dispatch') {
      return res.status(400).json({ message: `Cannot dispatch trip from current status: ${trip.status}` });
    }

    // Fetch and double-check vehicle/driver assignment before dispatching
    if (!trip.vehicle || !trip.driver) {
      return res.status(400).json({ message: "Cannot dispatch a trip without both a vehicle and driver assigned." });
    }

    const vehicle = await Vehicle.findById(trip.vehicle);
    const driver = await Driver.findById(trip.driver);

    if (!vehicle || vehicle.status === 'In Shop' || vehicle.status === 'Retired') {
      return res.status(400).json({ message: "Assigned vehicle is unavailable for dispatch." });
    }

    if (!driver || driver.status === 'Suspended' || driver.status === 'Expired') {
      return res.status(400).json({ message: "Assigned driver is ineligible for dispatch." });
    }

    // Perform State Transitions: Trip status -> Dispatched, Vehicle/Driver status -> On Trip
    trip.status = 'Dispatched';
    await trip.save();

    vehicle.status = 'On Trip';
    await vehicle.save();

    driver.status = 'On Trip';
    await driver.save();

    return res.status(200).json({ message: "Trip dispatched. Vehicle and Driver status set to 'On Trip'.", trip });
  } catch (error) {
    console.error("Error dispatching trip:", error);
    return res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

/**
 * Complete a trip: Transitions Trip status to 'Completed', and reverts Vehicle/Driver status to 'Available'.
 */
exports.completeTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found." });
    }

    if (trip.status !== 'Dispatched') {
      return res.status(400).json({ message: "Only active, dispatched trips can be completed." });
    }

    trip.status = 'Completed';
    await trip.save();

    // Revert statuses to Available
    if (trip.vehicle) {
      await Vehicle.findByIdAndUpdate(trip.vehicle, { status: 'Available' });
    }
    if (trip.driver) {
      await Driver.findByIdAndUpdate(trip.driver, { status: 'Available' });
    }

    return res.status(200).json({ message: "Trip successfully completed. Assets set back to 'Available'.", trip });
  } catch (error) {
    console.error("Error completing trip:", error);
    return res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

/**
 * Cancel a trip: Transitions Trip status to 'Cancelled', and reverts Vehicle/Driver status to 'Available'.
 */
exports.cancelTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found." });
    }

    if (trip.status === 'Completed' || trip.status === 'Cancelled') {
      return res.status(400).json({ message: `Cannot cancel a trip that is already ${trip.status}.` });
    }

    const originalStatus = trip.status;
    trip.status = 'Cancelled';
    await trip.save();

    // Revert statuses to Available (only if they were actually dispatched)
    if (originalStatus === 'Dispatched') {
      if (trip.vehicle) {
        await Vehicle.findByIdAndUpdate(trip.vehicle, { status: 'Available' });
      }
      if (trip.driver) {
        await Driver.findByIdAndUpdate(trip.driver, { status: 'Available' });
      }
    }

    return res.status(200).json({ message: "Trip cancelled. Assets set back to 'Available'.", trip });
  } catch (error) {
    console.error("Error cancelling trip:", error);
    return res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};
