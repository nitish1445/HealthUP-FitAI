import { WorkoutPlan } from "../models/Workout.js";
import { WorkoutLog } from "../models/Workout.js";
import { WeightLog } from "../models/TrackingLogs.js";
import { PlanAdjustment } from "../models/Intelligence.js";
import { computeWeeklyHabitScore } from "./habitService.js";

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

const completionPct = (logs) => {
  if (!logs.length) return null;
  return Math.round(
    (logs.filter((l) => l.status === "Completed").length / logs.length) * 100,
  );
};

const weeklyWeightChange = async (userId) => {
  const logs = await WeightLog.find({
    user: userId,
    date: { $gte: daysAgo(14) },
  }).sort({ date: 1 });
  if (logs.length < 2) return null;
  const first = logs[0];
  const last = logs[logs.length - 1];
  const spanDays =
    (new Date(last.date) - new Date(first.date)) / (1000 * 60 * 60 * 24) || 1;
  return ((last.weightKg - first.weightKg) / spanDays) * 7;
};

// Applies progressive-overload volume adjustments across all non-rest days of the active plan.
const applyVolumeAdjustment = (plan, percentChange) => {
  plan.days.forEach((day) => {
    if (day.isRestDay) return;
    day.exercises.forEach((ex) => {
      const newSets = Math.round(ex.sets * (1 + percentChange));
      ex.sets = Math.max(2, Math.min(6, newSets));
    });
  });
  plan.version += 1;
};

// Runs the weekly evaluation for a single user: adherence, weight trend, and rule-based adjustments.
// Persists any adjustment made and returns a summary the dashboard/coach can display.
export const runWeeklyEvaluation = async (userId, profile) => {
  const since = daysAgo(14);
  const recentWorkoutLogs = await WorkoutLog.find({
    user: userId,
    date: { $gte: since },
  });
  const twoWeekCompletionPct = completionPct(recentWorkoutLogs);
  const weeklyChangeKg = await weeklyWeightChange(userId);
  const habit = await computeWeeklyHabitScore(userId);

  const activePlan = await WorkoutPlan.findOne({ user: userId, active: true });
  const adjustments = [];

  if (activePlan && twoWeekCompletionPct !== null) {
    if (twoWeekCompletionPct >= 90) {
      applyVolumeAdjustment(activePlan, 0.075); // +5-10%
      await activePlan.save();
      adjustments.push({
        planType: "workout",
        trigger: "high_adherence",
        reason: "Workout completion has been above 90% for the last two weeks.",
        change: "Training volume increased by approximately 7.5%.",
        expectedOutcome:
          "Gradual progressive overload to continue driving results.",
      });
    } else if (twoWeekCompletionPct < 50) {
      applyVolumeAdjustment(activePlan, -0.15);
      await activePlan.save();
      adjustments.push({
        planType: "workout",
        trigger: "low_adherence",
        reason:
          "Workout completion has dropped below 50% over the last two weeks.",
        change:
          "Training intensity and volume were reduced to make the plan easier to stick to.",
        expectedOutcome:
          "A lighter plan you're more likely to complete consistently.",
      });
    }
  }

  if (weeklyChangeKg !== null && profile) {
    if (profile.primaryGoal === "Weight Loss") {
      if (weeklyChangeKg > -0.3 && weeklyChangeKg <= 0) {
        adjustments.push({
          planType: "diet",
          trigger: "slow_weight_loss",
          reason: `Weight loss is averaging about ${Math.abs(weeklyChangeKg).toFixed(2)} kg/week, below your target pace.`,
          change: "Consider a slightly larger calorie deficit next week.",
          expectedOutcome:
            "A modest increase in the rate of weight loss while staying within safe limits.",
        });
      } else if (weeklyChangeKg < -1) {
        adjustments.push({
          planType: "diet",
          trigger: "fast_weight_loss",
          reason: `Weight loss is averaging about ${Math.abs(weeklyChangeKg).toFixed(2)} kg/week, faster than recommended.`,
          change:
            "Consider reducing your calorie deficit for safety and muscle retention.",
          expectedOutcome:
            "A more sustainable rate of loss that protects lean mass.",
        });
      }
    }

    if (
      profile.primaryGoal === "Muscle Gain" &&
      Math.abs(weeklyChangeKg) < 0.1
    ) {
      adjustments.push({
        planType: "workout",
        trigger: "muscle_gain_stagnant",
        reason:
          "Weight has been essentially unchanged over the last two weeks despite a muscle gain goal.",
        change:
          "Training volume was increased to provide a stronger growth stimulus.",
        expectedOutcome: "Renewed progress toward your muscle gain goal.",
      });
    }
  }

  const savedAdjustments = await PlanAdjustment.insertMany(
    adjustments.map((a) => ({
      user: userId,
      previousPlanVersion: activePlan?.version,
      ...a,
    })),
  );

  return {
    twoWeekCompletionPct,
    weeklyChangeKg:
      weeklyChangeKg !== null ? Math.round(weeklyChangeKg * 100) / 100 : null,
    habitScore: habit.habitScore,
    adjustments: savedAdjustments,
  };
};

export const getRecentAdjustments = async (userId, limit = 10) => {
  return PlanAdjustment.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};
