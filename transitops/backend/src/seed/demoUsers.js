import mongoose from "mongoose";
import { connectDatabase } from "../config/database.js";
import { env } from "../config/env.js";
import { ROLES } from "../constants/enums.js";
import { User } from "../models/User.js";

const demoUsers = [
  { name: "Admin Demo", email: "admin@transitops.demo", role: ROLES.ADMIN },
  { name: "Fleet Demo", email: "fleet@transitops.demo", role: ROLES.FLEET_MANAGER },
  { name: "Dispatcher Demo", email: "dispatcher@transitops.demo", role: ROLES.DISPATCHER },
  { name: "Safety Demo", email: "safety@transitops.demo", role: ROLES.SAFETY_OFFICER },
  { name: "Finance Demo", email: "finance@transitops.demo", role: ROLES.FINANCIAL_ANALYST }
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
}

try {
  await seedDemoUsers();
} finally {
  await mongoose.connection.close(false);
}
