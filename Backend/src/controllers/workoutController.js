import { WorkoutPlan, WorkoutLog } from "../models/Workout.js";
import { FitnessProfile } from "../models/FitnessProfile.js";
import {
  generateWorkoutPlan,
  getTodayFocus,
} from "../services/workoutGenerationService.js";
import { AppError, asyncHandler } from "../utils/AppError.js";

export const getActiveWorkoutPlan = asyncHandler(async (req, res) => {
  const plan = await WorkoutPlan.findOne({ user: req.user._id, active: true });
  if (!plan) {
    return res
      .status(200)
      .json({
        success: true,
        data: null,
        message: "No active workout plan yet",
      });
  }
  res.status(200).json({ success: true, data: plan });
});

export const getTodayWorkout = asyncHandler(async (req, res) => {
  const plan = await WorkoutPlan.findOne({ user: req.user._id, active: true });
  if (!plan) {
    return res
      .status(200)
      .json({
        success: true,
        data: null,
        message: "No active workout plan yet",
      });
  }
  const today = getTodayFocus(plan);
  res.status(200).json({ success: true, data: { plan, today } });
});

export const regenerateWorkoutPlan = asyncHandler(async (req, res) => {
  const profile = await FitnessProfile.findOne({ user: req.user._id });
  if (!profile) {
    throw new AppError(
      "Complete your fitness profile before generating a plan",
      400,
    );
  }
  const plan = await generateWorkoutPlan(req.user._id, profile);
  res
    .status(201)
    .json({
      success: true,
      message: "Workout plan regenerated successfully",
      data: plan,
    });
});

export const logWorkout = asyncHandler(async (req, res) => {
  const { id } = req.params; // workoutPlan id
  const { dayName, status, exercisesCompleted, durationMinutes, notes } =
    req.validatedBody;

  const plan = await WorkoutPlan.findOne({ _id: id, user: req.user._id });
  if (!plan) throw new AppError("Workout plan not found", 404);

  const day = plan.days.find((d) => d.dayName === dayName);
  const volume = day
    ? day.exercises.reduce(
        (sum, ex) => sum + ex.sets * parseInt(ex.repsRange.split("-")[0], 10),
        0,
      )
    : 0;

  const log = await WorkoutLog.create({
    user: req.user._id,
    workoutPlan: plan._id,
    dayName,
    status,
    exercisesCompleted,
    durationMinutes,
    volume,
    notes,
  });

  res
    .status(201)
    .json({ success: true, message: "Workout logged successfully", data: log });
});

export const getWorkoutLogs = asyncHandler(async (req, res) => {
  const { limit = 30 } = req.query;
  const logs = await WorkoutLog.find({ user: req.user._id })
    .sort({ date: -1 })
    .limit(Number(limit));
  res.status(200).json({ success: true, data: logs });
});
