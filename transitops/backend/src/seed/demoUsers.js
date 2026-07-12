import mongoose from "mongoose";
import { connectDatabase } from "../config/database.js";
import { env, validateEnvironment } from "../config/env.js";
import {
  DRIVER_STATUSES,
  EXPENSE_CATEGORIES,
  LICENSE_CATEGORIES,
  MAINTENANCE_STATUSES,
  ROLES,
  TRIP_STATUSES,
  VEHICLE_STATUSES,
  VEHICLE_TYPES
} from "../constants/enums.js";
import { Driver } from "../models/Driver.js";
import { Expense } from "../models/Expense.js";
import { FuelLog } from "../models/FuelLog.js";
import { Maintenance } from "../models/Maintenance.js";
import { Trip } from "../models/Trip.js";
import { User } from "../models/User.js";
import { Vehicle } from "../models/Vehicle.js";

const demoUsers = [
  { name: "Admin Demo", email: "admin@transitops.demo", role: ROLES.ADMIN },
  { name: "Fleet Demo", email: "fleet@transitops.demo", role: ROLES.FLEET_MANAGER },
  { name: "Dispatcher Demo", email: "dispatcher@transitops.demo", role: ROLES.DISPATCHER },
  { name: "Safety Demo", email: "safety@transitops.demo", role: ROLES.SAFETY_OFFICER },
  { name: "Finance Demo", email: "finance@transitops.demo", role: ROLES.FINANCIAL_ANALYST }
];

const demoVehicles = [
  {
    registrationNumber: "TO-VAN-05",
    name: "Van-05",
    model: "Transit Demo Van",
    type: VEHICLE_TYPES.VAN,
    maximumLoadCapacity: 500,
    odometer: 12000,
    acquisitionCost: 650000,
    status: VEHICLE_STATUSES.AVAILABLE,
    region: "Demo Yard"
  },
  {
    registrationNumber: "TO-DEMO-101",
    name: "Demo Freight Truck",
    model: "Ashok Leyland 4825",
    type: VEHICLE_TYPES.TRUCK,
    maximumLoadCapacity: 18000,
    odometer: 42000,
    acquisitionCost: 2200000,
    status: VEHICLE_STATUSES.AVAILABLE,
    region: "Demo Yard"
  },
  {
    registrationNumber: "TO-DEMO-202",
    name: "Demo City Van",
    model: "Tata Winger",
    type: VEHICLE_TYPES.VAN,
    maximumLoadCapacity: 3500,
    odometer: 18500,
    acquisitionCost: 900000,
    status: VEHICLE_STATUSES.AVAILABLE,
    region: "Demo Yard"
  },
  {
    registrationNumber: "TO-ONTRIP-01",
    name: "On Trip Demo Truck",
    model: "Tata Prima",
    type: VEHICLE_TYPES.TRUCK,
    maximumLoadCapacity: 14000,
    odometer: 76000,
    acquisitionCost: 1800000,
    status: VEHICLE_STATUSES.ON_TRIP,
    region: "West"
  },
  {
    registrationNumber: "TO-INSHOP-01",
    name: "In Shop Demo Van",
    model: "Force Traveller",
    type: VEHICLE_TYPES.VAN,
    maximumLoadCapacity: 2200,
    odometer: 31000,
    acquisitionCost: 780000,
    status: VEHICLE_STATUSES.IN_SHOP,
    region: "South"
  },
  {
    registrationNumber: "TO-RETIRED-01",
    name: "Retired Demo Bus",
    model: "Volvo 9400",
    type: VEHICLE_TYPES.BUS,
    maximumLoadCapacity: 8000,
    odometer: 250000,
    acquisitionCost: 3200000,
    status: VEHICLE_STATUSES.RETIRED,
    retiredAt: new Date("2026-07-01T00:00:00.000Z"),
    region: "North"
  }
];

const demoDrivers = [
  {
    name: "Alex Demo",
    licenseNumber: "TO-ALEX-500",
    licenseCategory: LICENSE_CATEGORIES.COMMERCIAL,
    licenseExpiryDate: new Date("2031-12-31T00:00:00.000Z"),
    contactNumber: "+91 9000000005",
    safetyScore: 98,
    status: DRIVER_STATUSES.AVAILABLE,
    region: "Demo Yard"
  },
  {
    name: "Ravi Operations",
    licenseNumber: "TO-DEMO-DL-101",
    licenseCategory: LICENSE_CATEGORIES.HEAVY,
    licenseExpiryDate: new Date("2030-12-31T00:00:00.000Z"),
    contactNumber: "+91 9000000001",
    safetyScore: 94,
    status: DRIVER_STATUSES.AVAILABLE,
    region: "Demo Yard"
  },
  {
    name: "Asha Dispatch",
    licenseNumber: "TO-DEMO-DL-202",
    licenseCategory: LICENSE_CATEGORIES.COMMERCIAL,
    licenseExpiryDate: new Date("2030-12-31T00:00:00.000Z"),
    contactNumber: "+91 9000000002",
    safetyScore: 97,
    status: DRIVER_STATUSES.AVAILABLE,
    region: "Demo Yard"
  },
  {
    name: "On Trip Driver",
    licenseNumber: "TO-ONTRIP-DL-01",
    licenseCategory: LICENSE_CATEGORIES.HEAVY,
    licenseExpiryDate: new Date("2031-06-30T00:00:00.000Z"),
    contactNumber: "+91 9000000003",
    safetyScore: 88,
    status: DRIVER_STATUSES.ON_TRIP,
    region: "West"
  },
  {
    name: "Expired Licence Driver",
    licenseNumber: "TO-EXPIRED-DL-01",
    licenseCategory: LICENSE_CATEGORIES.HEAVY,
    licenseExpiryDate: new Date("2024-01-01T00:00:00.000Z"),
    contactNumber: "+91 9000000004",
    safetyScore: 81,
    status: DRIVER_STATUSES.AVAILABLE,
    region: "South"
  },
  {
    name: "Suspended Demo Driver",
    licenseNumber: "TO-SUSPENDED-DL-01",
    licenseCategory: LICENSE_CATEGORIES.COMMERCIAL,
    licenseExpiryDate: new Date("2030-01-01T00:00:00.000Z"),
    contactNumber: "+91 9000000006",
    safetyScore: 55,
    status: DRIVER_STATUSES.SUSPENDED,
    region: "North"
  }
];

async function upsertBy(model, filter, data) {
  return model.findOneAndUpdate(filter, { $set: data }, { new: true, setDefaultsOnInsert: true, upsert: true });
}

async function seedDemoUsers() {
  await connectDatabase();

  for (const demoUser of demoUsers) {
    const existingUser = await User.findOne({ email: demoUser.email });

    if (existingUser) {
      existingUser.name = demoUser.name;
      existingUser.role = demoUser.role;
      existingUser.isActive = true;

      if (process.env.RESET_DEMO_PASSWORDS === "true") {
        existingUser.password = env.demoUserPassword;
      }

      await existingUser.save();
      console.log(`Updated demo user ${demoUser.email}`);
      continue;
    }

    await User.create({
      ...demoUser,
      password: env.demoUserPassword,
      isActive: true
    });
    console.log(`Created demo user ${demoUser.email}`);
  }

  const seededVehicles = new Map();
  for (const vehicleDetails of demoVehicles) {
    const vehicle = await upsertBy(Vehicle, { registrationNumber: vehicleDetails.registrationNumber }, vehicleDetails);
    seededVehicles.set(vehicle.registrationNumber, vehicle);
  }

  const seededDrivers = new Map();
  for (const driverDetails of demoDrivers) {
    const driver = await upsertBy(Driver, { licenseNumber: driverDetails.licenseNumber }, driverDetails);
    seededDrivers.set(driver.licenseNumber, driver);
  }

  const admin = await User.findOne({ email: "admin@transitops.demo" });
  const userId = admin?._id ?? null;
  const availableVehicle = seededVehicles.get("TO-DEMO-101");
  const onTripVehicle = seededVehicles.get("TO-ONTRIP-01");
  const inShopVehicle = seededVehicles.get("TO-INSHOP-01");
  const van05 = seededVehicles.get("TO-VAN-05");
  const availableDriver = seededDrivers.get("TO-DEMO-DL-101");
  const onTripDriver = seededDrivers.get("TO-ONTRIP-DL-01");
  const alex = seededDrivers.get("TO-ALEX-500");

  const demoTrips = [
    {
      tripNumber: "TRIP-DEMO-DRAFT",
      source: "Bengaluru",
      destination: "Mysuru",
      vehicle: availableVehicle._id,
      driver: availableDriver._id,
      cargoWeight: 900,
      distance: 145,
      revenue: 18000,
      fuel: 38,
      status: TRIP_STATUSES.DRAFT,
      timeline: [{ status: TRIP_STATUSES.DRAFT, note: "Seeded draft trip", changedBy: userId }]
    },
    {
      tripNumber: "TRIP-DEMO-DISPATCHED",
      source: "Mumbai",
      destination: "Pune",
      vehicle: onTripVehicle._id,
      driver: onTripDriver._id,
      cargoWeight: 3000,
      distance: 150,
      revenue: 26000,
      fuel: 55,
      status: TRIP_STATUSES.DISPATCHED,
      dispatchedAt: new Date("2026-07-10T08:00:00.000Z"),
      timeline: [{ status: TRIP_STATUSES.DISPATCHED, note: "Seeded dispatched trip", changedBy: userId }]
    },
    {
      tripNumber: "TRIP-DEMO-COMPLETED",
      source: "Delhi",
      destination: "Jaipur",
      vehicle: seededVehicles.get("TO-DEMO-202")._id,
      driver: seededDrivers.get("TO-DEMO-DL-202")._id,
      cargoWeight: 1200,
      distance: 280,
      revenue: 42000,
      fuel: 74,
      status: TRIP_STATUSES.COMPLETED,
      dispatchedAt: new Date("2026-07-08T08:00:00.000Z"),
      completedAt: new Date("2026-07-08T18:00:00.000Z"),
      timeline: [{ status: TRIP_STATUSES.COMPLETED, note: "Seeded completed trip", changedBy: userId }]
    },
    {
      tripNumber: "TRIP-DEMO-CANCELLED",
      source: "Chennai",
      destination: "Coimbatore",
      vehicle: van05._id,
      driver: alex._id,
      cargoWeight: 450,
      distance: 500,
      revenue: 30000,
      fuel: 80,
      status: TRIP_STATUSES.CANCELLED,
      cancelledAt: new Date("2026-07-09T11:00:00.000Z"),
      timeline: [{ status: TRIP_STATUSES.CANCELLED, note: "Seeded cancelled trip", changedBy: userId }]
    }
  ];

  const seededTrips = new Map();
  for (const tripDetails of demoTrips) {
    const trip = await upsertBy(Trip, { tripNumber: tripDetails.tripNumber }, { ...tripDetails, createdBy: userId, updatedBy: userId });
    seededTrips.set(trip.tripNumber, trip);
  }

  await upsertBy(
    Maintenance,
    { vehicle: inShopVehicle._id, title: "Demo Brake Inspection" },
    {
      vehicle: inShopVehicle._id,
      title: "Demo Brake Inspection",
      description: "Seeded active maintenance keeps this vehicle out of dispatch options.",
      cost: 12500,
      status: MAINTENANCE_STATUSES.ACTIVE,
      openedAt: new Date("2026-07-11T10:00:00.000Z"),
      history: [{ status: MAINTENANCE_STATUSES.ACTIVE, note: "Seeded maintenance", changedBy: userId }],
      createdBy: userId,
      updatedBy: userId
    }
  );

  await upsertBy(
    FuelLog,
    { vehicle: seededVehicles.get("TO-DEMO-202")._id, vendor: "TransitOps Demo Fuel" },
    {
      vehicle: seededVehicles.get("TO-DEMO-202")._id,
      trip: seededTrips.get("TRIP-DEMO-COMPLETED")._id,
      liters: 74,
      cost: 7400,
      odometer: 18780,
      filledAt: new Date("2026-07-08T19:00:00.000Z"),
      vendor: "TransitOps Demo Fuel",
      region: "North",
      createdBy: userId,
      updatedBy: userId
    }
  );

  await upsertBy(
    Expense,
    { description: "TransitOps Demo Toll Expense" },
    {
      category: EXPENSE_CATEGORIES.TOLL,
      amount: 3200,
      description: "TransitOps Demo Toll Expense",
      vehicle: seededVehicles.get("TO-DEMO-202")._id,
      trip: seededTrips.get("TRIP-DEMO-COMPLETED")._id,
      expenseDate: new Date("2026-07-08T12:00:00.000Z"),
      region: "North",
      createdBy: userId,
      updatedBy: userId
    }
  );

  console.log(
    `Seeded ${demoVehicles.length} vehicles, ${demoDrivers.length} drivers, ${demoTrips.length} trips, maintenance, fuel, and expense demo records.`
  );
}

try {
  validateEnvironment();
  await seedDemoUsers();
} finally {
  await mongoose.connection.close(false);
}
