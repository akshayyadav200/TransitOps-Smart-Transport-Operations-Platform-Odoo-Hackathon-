import mongoose from "mongoose";
import { connectDatabase } from "../config/database.js";
import { env, validateEnvironment } from "../config/env.js";
import { DRIVER_STATUSES, LICENSE_CATEGORIES, ROLES, VEHICLE_STATUSES, VEHICLE_TYPES } from "../constants/enums.js";
import { Driver } from "../models/Driver.js";
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
    registrationNumber: "TO-DEMO-101",
    name: "Demo Freight Truck",
    model: "Ashok Leyland 4825",
    type: VEHICLE_TYPES.TRUCK,
    maximumLoadCapacity: 18000,
    odometer: 42000,
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
    status: VEHICLE_STATUSES.AVAILABLE,
    region: "Demo Yard"
  }
];

const demoDrivers = [
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
  }
];

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

  for (const vehicleDetails of demoVehicles) {
    await Vehicle.updateOne(
      { registrationNumber: vehicleDetails.registrationNumber },
      { $setOnInsert: vehicleDetails },
      { upsert: true }
    );
  }

  for (const driverDetails of demoDrivers) {
    await Driver.updateOne(
      { licenseNumber: driverDetails.licenseNumber },
      { $setOnInsert: driverDetails },
      { upsert: true }
    );
  }

  console.log(`Seeded ${demoVehicles.length} demo vehicles and ${demoDrivers.length} demo drivers.`);
}

try {
  validateEnvironment();
  await seedDemoUsers();
} finally {
  await mongoose.connection.close(false);
}
