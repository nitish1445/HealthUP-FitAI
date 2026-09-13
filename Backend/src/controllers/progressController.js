import { WeightLog, MeasurementLog } from "../models/TrackingLogs.js";
import { WorkoutLog } from "../models/Workout.js";
import { DietLog } from "../models/Diet.js";
import { asyncHandler } from "../utils/AppError.js";

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

export const logWeight = asyncHandler(async (req, res) => {
  const { date, weightKg } = req.validatedBody;
  const log = await WeightLog.create({
    user: req.user._id,
    date: date ? new Date(date) : new Date(),
    weightKg,
  });
  
  res
    .status(201)
    .json({ success: true, message: "Weight logged successfully", data: log });
});

export const logMeasurements = asyncHandler(async (req, res) => {
  const payload = req.validatedBody;
  const log = await MeasurementLog.create({
    user: req.user._id,
    date: payload.date ? new Date(payload.date) : new Date(),
    ...payload,
  });
  res
    .status(201)
    .json({ success: true, message: "Measurements updated", data: log });
});

// Aggregates weight, measurement, and adherence trends for a given lookback window.
export const getProgress = asyncHandler(async (req, res) => {
  const weeks = Math.min(Math.max(Number(req.query.weeks) || 4, 1), 52);
  const since = daysAgo(weeks * 7);

  const [weightLogs, measurementLogs, workoutLogs, dietLogs] =
    await Promise.all([
      WeightLog.find({ user: req.user._id, date: { $gte: since } }).sort({
        date: 1,
      }),
      MeasurementLog.find({ user: req.user._id, date: { $gte: since } }).sort({
        date: 1,
      }),
      WorkoutLog.find({ user: req.user._id, date: { $gte: since } }),
      DietLog.find({ user: req.user._id, date: { $gte: since } }),
    ]);

  const workoutCompletionPct = workoutLogs.length
    ? Math.round(
        (workoutLogs.filter((l) => l.status === "Completed").length /
          workoutLogs.length) *
          100,
      )
    : null;

  const dietAdherencePct = dietLogs.length
    ? Math.round(
        (dietLogs.filter((l) => l.adherence === "Followed").length /
          dietLogs.length) *
          100,
      )
    : null;

  res.status(200).json({
    success: true,
    data: {
      windowWeeks: weeks,
      weightLogs,
      measurementLogs,
      workoutCompletionPct,
      dietAdherencePct,
      hasData:
        weightLogs.length > 0 ||
        measurementLogs.length > 0 ||
        workoutLogs.length > 0 ||
        dietLogs.length > 0,
    },
  });
});
