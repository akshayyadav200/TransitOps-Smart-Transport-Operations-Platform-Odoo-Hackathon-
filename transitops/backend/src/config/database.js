import mongoose from "mongoose";
import { env } from "./env.js";

const CONNECTION_STATES = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting"
};

let mongoMemoryServer = null;

async function seedDemoData() {
  try {
    const { Vehicle } = await import("../models/Vehicle.js");
    const { Driver } = await import("../models/Driver.js");

    const vehicleCount = await Vehicle.countDocuments();
    const driverCount = await Driver.countDocuments();

    if (vehicleCount === 0 && driverCount === 0) {
      console.log("Seeding in-memory database with hackathon demo data...");

      // Seed Vehicles
      await Vehicle.insertMany([
        {
          registrationNumber: "MH-12-PQ-1234",
          name: "Volvo FH16 Heavy Duty",
          model: "FH16",
          type: "Truck",
          maximumLoadCapacity: 25000,
          odometer: 12500,
          acquisitionCost: 85000,
          region: "West",
          status: "Available"
        },
        {
          registrationNumber: "DL-01-AB-5678",
          name: "Ford Transit Connect",
          model: "Transit",
          type: "Van",
          maximumLoadCapacity: 3500,
          odometer: 45000,
          acquisitionCost: 32000,
          region: "North",
          status: "Available"
        },
        {
          registrationNumber: "KA-03-XY-9012",
          name: "Tata Prima 4028.S",
          model: "Prima 4028",
          type: "Truck",
          maximumLoadCapacity: 40000,
          odometer: 68000,
          acquisitionCost: 95000,
          region: "South",
          status: "On Trip"
        },
        {
          registrationNumber: "HR-26-CD-3456",
          name: "Eicher Pro 2049",
          model: "Pro 2049",
          type: "Truck",
          maximumLoadCapacity: 5000,
          odometer: 18000,
          acquisitionCost: 22000,
          region: "North",
          status: "In Shop"
        },
        {
          registrationNumber: "KA-51-EF-7890",
          name: "Mercedes Sprinter Van",
          model: "Sprinter",
          type: "Van",
          maximumLoadCapacity: 4000,
          odometer: 92000,
          acquisitionCost: 45000,
          region: "South",
          status: "Retired"
        }
      ]);

      // Seed Drivers
      const today = new Date();
      
      const oneYearLater = new Date(today);
      oneYearLater.setFullYear(today.getFullYear() + 1);

      const sixMonthsLater = new Date(today);
      sixMonthsLater.setMonth(today.getMonth() + 6);

      const oneMonthAgo = new Date(today);
      oneMonthAgo.setMonth(today.getMonth() - 1);

      const twoYearsLater = new Date(today);
      twoYearsLater.setFullYear(today.getFullYear() + 2);

      const tenDaysLater = new Date(today);
      tenDaysLater.setDate(today.getDate() + 10);

      await Driver.insertMany([
        {
          name: "Rajesh Kumar",
          licenseNumber: "DL1420210098765",
          licenseCategory: "Heavy",
          licenseExpiryDate: oneYearLater,
          contactNumber: "+91 98765 43210",
          safetyScore: 92,
          region: "North",
          status: "Available"
        },
        {
          name: "Amit Sharma",
          licenseNumber: "MH1220190012345",
          licenseCategory: "Heavy",
          licenseExpiryDate: sixMonthsLater,
          contactNumber: "+91 87654 32109",
          safetyScore: 88,
          region: "West",
          status: "Available"
        },
        {
          name: "Vijay Mallya",
          licenseNumber: "KA0320150054321",
          licenseCategory: "Commercial",
          licenseExpiryDate: oneMonthAgo,
          contactNumber: "+91 76543 21098",
          safetyScore: 75,
          region: "South",
          status: "Available"
        },
        {
          name: "Sanjay Dutt",
          licenseNumber: "MH0119900000007",
          licenseCategory: "Heavy",
          licenseExpiryDate: twoYearsLater,
          contactNumber: "+91 99999 99999",
          safetyScore: 45,
          region: "West",
          status: "Suspended"
        },
        {
          name: "Karan Johar",
          licenseNumber: "DL0420230076543",
          licenseCategory: "Light",
          licenseExpiryDate: tenDaysLater,
          contactNumber: "+91 88888 88888",
          safetyScore: 95,
          region: "North",
          status: "On Trip"
        }
      ]);

      console.log("In-memory database seeded successfully.");
    }
  } catch (error) {
    console.error(`Failed to seed demo data: ${error.message}`);
  }
}

export async function connectDatabase() {
  try {
    console.log(`Connecting to MongoDB at: ${env.databaseUrl}`);
    await mongoose.connect(env.databaseUrl, {
      serverSelectionTimeoutMS: 2000
    });
    console.log("Database connected successfully.");
  } catch (error) {
    console.warn(`Local database connection failed: ${error.message}`);
    console.log("Starting in-memory MongoDB database fallback...");
    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      mongoMemoryServer = await MongoMemoryServer.create();
      const uri = mongoMemoryServer.getUri();
      console.log(`In-memory MongoDB database started at: ${uri}`);
      await mongoose.connect(uri);
      console.log("Connected to in-memory MongoDB successfully.");
      
      // Seed initial dummy data since it is a blank in-memory database
      await seedDemoData();
    } catch (fallbackError) {
      console.error(`In-memory database startup failed: ${fallbackError.message}`);
      throw fallbackError;
    }
  }
}

export function getDatabaseState() {
  return CONNECTION_STATES[mongoose.connection.readyState] ?? "unknown";
}

