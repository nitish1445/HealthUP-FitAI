import { FitnessProfile } from "../models/FitnessProfile.js";
import { WorkoutPlan, WorkoutLog } from "../models/Workout.js";
import { DietPlan, DietLog } from "../models/Diet.js";
import { WeightLog } from "../models/TrackingLogs.js";
import { HabitScore } from "../models/Intelligence.js";
import {
  computeWeeklyHabitScore,
  getHabitHistory,
} from "../services/habitService.js";
import { getRecoveryInsights } from "../services/recoveryService.js";
import { getGoalForecast } from "../services/forecastService.js";
import { getRecentAdjustments } from "../services/planAdjustmentService.js";
import { getTodayFocus } from "../services/workoutGenerationService.js";
import { asyncHandler } from "../utils/AppError.js";

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

// GET /api/analytics — deeper multi-week analytics used by the Analytics page.
export const getAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const since = daysAgo(56); // 8 weeks

  const [habitHistory, workoutLogs, dietLogs, weightLogs] = await Promise.all([
    getHabitHistory(userId, 8),
    WorkoutLog.find({ user: userId, date: { $gte: since } }).sort({ date: 1 }),
    DietLog.find({ user: userId, date: { $gte: since } }).sort({ date: 1 }),
    WeightLog.find({ user: userId, date: { $gte: since } }).sort({ date: 1 }),
  ]);

  const totalVolume = workoutLogs.reduce((sum, l) => sum + (l.volume || 0), 0);

  const macroAccuracy = dietLogs.length
    ? Math.round(
        (dietLogs.filter(
          (l) => l.adherence === "Followed" || l.adherence === "Mostly",
        ).length /
          dietLogs.length) *
          100,
      )
    : null;

  // Simple velocity: recent 4-week habit average vs prior 4-week average
  const recentHabit = habitHistory.slice(0, 4);
  const priorHabit = habitHistory.slice(4, 8);
  const avg = (arr) =>
    arr.length ? arr.reduce((s, h) => s + h.habitScore, 0) / arr.length : null;
  const recentAvg = avg(recentHabit);
  const priorAvg = avg(priorHabit);
  const velocityDeltaPct =
    recentAvg !== null && priorAvg !== null && priorAvg > 0
      ? Math.round(((recentAvg - priorAvg) / priorAvg) * 100)
      : null;

  res.status(200).json({
    success: true,
    data: {
      habitHistory,
      totalTrainingVolume: totalVolume,
      macroAccuracyPct: macroAccuracy,
      velocityDeltaPct,
      weightLogs,
      hasData:
        workoutLogs.length > 0 || dietLogs.length > 0 || weightLogs.length > 0,
    },
  });
});

// GET /api/roadmap — 8-week projected roadmap based on current plan/goal.
export const getRoadmap = asyncHandler(async (req, res) => {
  const profile = await FitnessProfile.findOne({ user: req.user._id });
  if (!profile) {
    return res
      .status(200)
      .json({
        success: true,
        data: null,
        message: "Complete your profile to see a roadmap",
      });
  }

  const weeks = Array.from({ length: 8 }, (_, i) => {
    const weekNum = i + 1;
    let intensityNote = "Maintain current training volume";
    let dietNote = "Hold current calorie target";
    if (weekNum % 2 === 0 && weekNum > 2) {
      intensityNote = "Volume may increase ~5-10% if adherence stays high";
    }
    if (weekNum === 4 || weekNum === 8) {
      dietNote = "Plan will be reviewed and adjusted based on your progress";
    }
    return {
      week: weekNum,
      intensityNote,
      dietNote,
      milestone:
        weekNum === 4
          ? "First monthly check-in and plan review"
          : weekNum === 8
            ? "Second monthly check-in and plan review"
            : null,
    };
  });

  res
    .status(200)
    .json({ success: true, data: { goal: profile.primaryGoal, weeks } });
});

// GET /api/dashboard — the single aggregated call the dashboard page uses.
export const getDashboardSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const profile = await FitnessProfile.findOne({ user: userId });
  if (!profile) {
    return res
      .status(200)
      .json({
        success: true,
        data: null,
        message: "Profile not completed yet",
      });
  }

  const [
    workoutPlan,
    dietPlan,
    habit,
    recovery,
    forecast,
    adjustments,
    lastWeight,
  ] = await Promise.all([
    WorkoutPlan.findOne({ user: userId, active: true }),
    DietPlan.findOne({ user: userId, active: true }),
    computeWeeklyHabitScore(userId),
    getRecoveryInsights(userId),
    getGoalForecast(userId, profile),
    getRecentAdjustments(userId, 3),
    WeightLog.findOne({ user: userId }).sort({ date: -1 }),
  ]);

  const todayWorkout = workoutPlan ? getTodayFocus(workoutPlan) : null;

  res.status(200).json({
    success: true,
    data: {
      profile,
      currentWeightKg: lastWeight
        ? lastWeight.weightKg
        : profile.currentWeightKg,
      todayWorkout,
      dietPlan,
      habit,
      recovery,
      forecast,
      recentAdjustments: adjustments,
    },
  });
});
