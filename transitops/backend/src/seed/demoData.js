import mongoose from "mongoose";
import { connectDatabase } from "../config/database.js";
import { Driver } from "../models/Driver.js";
import { Expense } from "../models/Expense.js";
import { Fuel } from "../models/Fuel.js";
import { Trip } from "../models/Trip.js";
import { Vehicle } from "../models/Vehicle.js";
import {
  DRIVER_STATUSES,
  EXPENSE_CATEGORIES,
  FUEL_TYPES,
  TRIP_STATUSES,
  VEHICLE_STATUSES,
  VEHICLE_TYPES
} from "../constants/enums.js";

const DEMO_OPERATOR = "Demo Finance Ops";

function daysFromNow(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

async function upsertVehicle(vehicle) {
  return Vehicle.findOneAndUpdate({ registrationNumber: vehicle.registrationNumber }, vehicle, {
    new: true,
    runValidators: true,
    upsert: true
  });
}

async function upsertDriver(driver) {
  return Driver.findOneAndUpdate({ licenseNumber: driver.licenseNumber }, driver, {
    new: true,
    runValidators: true,
    upsert: true
  });
}

async function upsertTrip(trip) {
  return Trip.findOneAndUpdate({ tripCode: trip.tripCode }, trip, {
    new: true,
    runValidators: true,
    upsert: true
  });
}

async function seed() {
  await connectDatabase();

  const vehicles = await Promise.all([
    upsertVehicle({
      registrationNumber: "KA01TA2045",
      name: "Bengaluru Freightliner",
      model: "Tata Prima 5530",
      type: VEHICLE_TYPES.TRUCK,
      maximumLoadCapacity: 18000,
      odometer: 128400,
      acquisitionCost: 4200000,
      region: "South",
      status: VEHICLE_STATUSES.ON_TRIP
    }),
    upsertVehicle({
      registrationNumber: "MH12TR8711",
      name: "Pune Express Van",
      model: "Eicher Pro 2059",
      type: VEHICLE_TYPES.VAN,
      maximumLoadCapacity: 5200,
      odometer: 76200,
      acquisitionCost: 1800000,
      region: "West",
      status: VEHICLE_STATUSES.AVAILABLE
    }),
    upsertVehicle({
      registrationNumber: "DL04BU9921",
      name: "Delhi Passenger Coach",
      model: "Volvo 9400",
      type: VEHICLE_TYPES.BUS,
      maximumLoadCapacity: 9200,
      odometer: 214000,
      acquisitionCost: 6200000,
      region: "North",
      status: VEHICLE_STATUSES.IN_SHOP
    }),
    upsertVehicle({
      registrationNumber: "TN09TK4420",
      name: "Chennai Tanker",
      model: "Ashok Leyland 2820",
      type: VEHICLE_TYPES.TANKER,
      maximumLoadCapacity: 16000,
      odometer: 98250,
      acquisitionCost: 5100000,
      region: "South",
      status: VEHICLE_STATUSES.AVAILABLE
    })
  ]);

  const drivers = await Promise.all([
    upsertDriver({
      name: "Aarav Menon",
      licenseNumber: "DL-SOUTH-1001",
      licenseCategory: "Heavy",
      licenseExpiryDate: daysFromNow(540),
      contactNumber: "+91 98765 10101",
      safetyScore: 94,
      region: "South",
      status: DRIVER_STATUSES.ON_TRIP
    }),
    upsertDriver({
      name: "Meera Sharma",
      licenseNumber: "DL-WEST-2204",
      licenseCategory: "Commercial",
      licenseExpiryDate: daysFromNow(420),
      contactNumber: "+91 98765 20202",
      safetyScore: 91,
      region: "West",
      status: DRIVER_STATUSES.AVAILABLE
    }),
    upsertDriver({
      name: "Kabir Khan",
      licenseNumber: "DL-NORTH-3320",
      licenseCategory: "Passenger",
      licenseExpiryDate: daysFromNow(260),
      contactNumber: "+91 98765 30303",
      safetyScore: 87,
      region: "North",
      status: DRIVER_STATUSES.OFF_DUTY
    })
  ]);

  const trips = await Promise.all([
    upsertTrip({
      tripCode: "TRIP-SOUTH-001",
      vehicleId: vehicles[0]._id,
      driverId: drivers[0]._id,
      origin: "Bengaluru",
      destination: "Hyderabad",
      region: "South",
      status: TRIP_STATUSES.DISPATCHED,
      scheduledStart: daysFromNow(0),
      scheduledEnd: daysFromNow(1),
      distanceKm: 575,
      revenue: 145000
    }),
    upsertTrip({
      tripCode: "TRIP-WEST-014",
      vehicleId: vehicles[1]._id,
      driverId: drivers[1]._id,
      origin: "Pune",
      destination: "Mumbai",
      region: "West",
      status: TRIP_STATUSES.COMPLETED,
      scheduledStart: daysFromNow(-4),
      scheduledEnd: daysFromNow(-3),
      distanceKm: 168,
      revenue: 46000
    }),
    upsertTrip({
      tripCode: "TRIP-NORTH-022",
      vehicleId: vehicles[2]._id,
      driverId: drivers[2]._id,
      origin: "Delhi",
      destination: "Jaipur",
      region: "North",
      status: TRIP_STATUSES.CANCELLED,
      scheduledStart: daysFromNow(-2),
      scheduledEnd: daysFromNow(-1),
      distanceKm: 281,
      revenue: 0
    }),
    upsertTrip({
      tripCode: "TRIP-SOUTH-031",
      vehicleId: vehicles[3]._id,
      driverId: drivers[0]._id,
      origin: "Chennai",
      destination: "Coimbatore",
      region: "South",
      status: TRIP_STATUSES.DRAFT,
      scheduledStart: daysFromNow(2),
      scheduledEnd: daysFromNow(3),
      distanceKm: 505,
      revenue: 118000
    })
  ]);

  await Promise.all([
    Fuel.deleteMany({ vehicleId: { $in: vehicles.map((vehicle) => vehicle._id) }, filledBy: DEMO_OPERATOR }),
    Expense.deleteMany({ vehicleId: { $in: vehicles.map((vehicle) => vehicle._id) }, createdBy: DEMO_OPERATOR })
  ]);

  await Fuel.insertMany([
    {
      vehicleId: vehicles[0]._id,
      tripId: trips[0]._id,
      liters: 165,
      cost: 154275,
      fuelType: FUEL_TYPES.DIESEL,
      date: daysFromNow(-1),
      odometer: 128120,
      filledBy: DEMO_OPERATOR
    },
    {
      vehicleId: vehicles[1]._id,
      tripId: trips[1]._id,
      liters: 42,
      cost: 40740,
      fuelType: FUEL_TYPES.DIESEL,
      date: daysFromNow(-5),
      odometer: 76060,
      filledBy: DEMO_OPERATOR
    },
    {
      vehicleId: vehicles[3]._id,
      tripId: trips[3]._id,
      liters: 128,
      cost: 119680,
      fuelType: FUEL_TYPES.DIESEL,
      date: daysFromNow(-3),
      odometer: 98130,
      filledBy: DEMO_OPERATOR
    }
  ]);

  await Expense.insertMany([
    {
      vehicleId: vehicles[0]._id,
      tripId: trips[0]._id,
      category: EXPENSE_CATEGORIES.TOLL,
      amount: 8200,
      description: "Highway tolls for Bengaluru to Hyderabad route",
      date: daysFromNow(-1),
      createdBy: DEMO_OPERATOR
    },
    {
      vehicleId: vehicles[1]._id,
      tripId: trips[1]._id,
      category: EXPENSE_CATEGORIES.PARKING,
      amount: 1200,
      description: "Mumbai city depot parking",
      date: daysFromNow(-4),
      createdBy: DEMO_OPERATOR
    },
    {
      vehicleId: vehicles[2]._id,
      tripId: trips[2]._id,
      category: EXPENSE_CATEGORIES.MAINTENANCE,
      amount: 68000,
      description: "Brake assembly inspection and replacement",
      date: daysFromNow(-2),
      createdBy: DEMO_OPERATOR
    },
    {
      vehicleId: vehicles[3]._id,
      tripId: trips[3]._id,
      category: EXPENSE_CATEGORIES.INSURANCE,
      amount: 32000,
      description: "Quarterly tanker insurance allocation",
      date: daysFromNow(-6),
      createdBy: DEMO_OPERATOR
    },
    {
      vehicleId: vehicles[0]._id,
      tripId: trips[0]._id,
      category: EXPENSE_CATEGORIES.REPAIR,
      amount: 15600,
      description: "Minor suspension repair before dispatch",
      date: daysFromNow(-7),
      createdBy: DEMO_OPERATOR
    }
  ]);

  console.log("TransitOps demo data seeded successfully");
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
