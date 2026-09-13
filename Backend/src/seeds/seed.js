import "dotenv/config";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import mongoose from "mongoose";

const run = async () => {
  await connectDB();

  const adminEmail = "sarainitish@gmail.com";
  const existing = await User.findOne({ email: adminEmail });

  if (existing) {
    console.log("[seed] Admin user already exists, skipping.");
  } else {
    await User.create({
      name: "Nitish Kumar",
      email: adminEmail,
      password: "qwerty123",
    });
    console.log(`[seed] Admin user created: ${adminEmail}.`);
  }

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
