import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import cron from "node-cron";

import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import workoutRoutes from "./src/routes/workoutRoutes.js";
import dietRoutes from "./src/routes/dietRoutes.js";
import progressRoutes from "./src/routes/progressRoutes.js";
import intelligenceRoutes from "./src/routes/intelligenceRoutes.js";
import miscRoutes from "./src/routes/miscRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import { notFound, errorHandler } from "./src/middleware/errorHandler.js";
import { FitnessProfile } from "./src/models/FitnessProfile.js";
import { runWeeklyEvaluation } from "./src/services/planAdjustmentService.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(mongoSanitize());

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HealthUP API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/diet", dietRoutes);
app.use("/api/progress", progressRoutes);

/* Intelligence: habits, recovery, forecast, plans, coach */
app.use("/api", intelligenceRoutes);

/* Misc: analytics, roadmap, dashboard */
app.use("/api", miscRoutes);
app.use("/api/admin", adminRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

//weekly evaluation cron job
const runWeeklyPlanEvaluation = async () => {
  console.log("[cron] Running weekly plan evaluation for all users...");

  try {
    const profiles = await FitnessProfile.find();
    for (const profile of profiles) {
      try {
        await runWeeklyEvaluation(profile.user, profile);
      } catch (err) {
        console.error(
          `[cron] Evaluation failed for user ${profile.user}:`,
          err.message,
        );
      }
    }

    console.log(
      `[cron] Weekly evaluation complete for ${profiles.length} users.`,
    );
  } catch (err) {
    console.error("[cron] Weekly evaluation job failed:", err.message);
  }
};

// start server and connect to database
const start = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`[server] HealthUP API listening on port ${PORT}`);
    });

    // Runs every Monday at 03:00 server time.
    // Automatically evaluates plans for users with fitness profiles.

    cron.schedule("0 3 * * 1", runWeeklyPlanEvaluation);
  } catch (error) {
    console.error("[server] Failed to start server:", error.message);
    process.exit(1);
  }
};

start();

export default app;
