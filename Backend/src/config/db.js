import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri)
      throw new Error("MONGO_URI is not defined in environment variables");

    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(uri);
    console.log(
      `[db] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`,
    );

    mongoose.connection.on("error", (err) => {
      console.error("[db] MongoDB connection error:", err.message);
    });

    return conn;
  } catch (err) {
    console.error(`[db] Failed to connect to MongoDB: ${err.message}`);
    process.exit(1);
  }
};
