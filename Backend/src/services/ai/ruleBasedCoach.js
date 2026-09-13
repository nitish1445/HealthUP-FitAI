import { WeightLog } from "../../models/TrackingLogs.js";
import { WorkoutLog } from "../../models/Workout.js";
import { DietLog } from "../../models/Diet.js";
import { EnergyLog } from "../../models/TrackingLogs.js";
import { computeWeeklyHabitScore } from "../habitService.js";
import { getGoalForecast } from "../forecastService.js";

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);
const DISCLAIMER = "This is general fitness guidance and not medical advice.";

// Builds the full data context the coach reasons over. Kept separate so an
// LLM provider can later consume the same context object (see aiProvider.js).
export const buildCoachContext = async (userId, profile) => {
  const [weightLogs, workoutLogs, dietLogs, energyLogs, habit, forecast] = await Promise.all([
    WeightLog.find({ user: userId, date: { $gte: daysAgo(28) } }).sort({ date: 1 }),
    WorkoutLog.find({ user: userId, date: { $gte: daysAgo(14) } }),
    DietLog.find({ user: userId, date: { $gte: daysAgo(14) } }),
    EnergyLog.find({ user: userId, date: { $gte: daysAgo(7) } }),
    computeWeeklyHabitScore(userId),
    getGoalForecast(userId, profile),
  ]);

  const workoutAdherence = workoutLogs.length
    ? Math.round((workoutLogs.filter((l) => l.status === "Completed").length / workoutLogs.length) * 100)
    : null;
  const dietAdherence = dietLogs.length
    ? Math.round((dietLogs.filter((l) => l.adherence === "Followed").length / dietLogs.length) * 100)
    : null;

  let weightTrendKgPerWeek = null;
  if (weightLogs.length >= 2) {
    const first = weightLogs[0];
    const last = weightLogs[weightLogs.length - 1];
    const spanDays = (new Date(last.date) - new Date(first.date)) / (1000 * 60 * 60 * 24) || 1;
    weightTrendKgPerWeek = ((last.weightKg - first.weightKg) / spanDays) * 7;
  }

  const fatigueFlags = energyLogs.filter(
    (l) => l.energyLevel === "Slightly Fatigued" || l.energyLevel === "Very Tired"
  ).length;

  return {
    goal: profile.primaryGoal,
    calorieTarget: profile.calorieTarget,
    workoutAdherence,
    dietAdherence,
    habitScore: habit.habitScore,
    weightTrendKgPerWeek: weightTrendKgPerWeek !== null ? Math.round(weightTrendKgPerWeek * 100) / 100 : null,
    fatigueFlags,
    forecast,
  };
};

const fmt = (n) => (n === null || n === undefined ? "unknown" : n);

// Rule-based responses keyed by question intent. Falls back to a general status summary.
export const answerWithRules = (question, ctx) => {
  const q = question.toLowerCase();

  if (q.includes("not losing weight") || q.includes("plateau")) {
    const trend = ctx.weightTrendKgPerWeek;
    const explanation =
      trend === null
        ? "There isn't enough recent weight data to evaluate your trend yet."
        : trend <= -0.05
        ? `Your current weight trend shows approximately ${Math.abs(trend)} kg/week of loss.`
        : `Your weight has been roughly stable over the recent period (${trend} kg/week).`;

    const step =
      ctx.dietAdherence !== null && ctx.dietAdherence < 70
        ? "Your diet adherence is on the lower side — tightening consistency there is likely to help more than changing the plan itself."
        : "Your adherence looks solid. Consider reviewing your calorie target, since intake needs can shift as body weight changes.";

    return [explanation, step, DISCLAIMER].join("\n\n");
  }

  if (q.includes("protein")) {
    const macro = ctx.calorieTarget ? Math.round((ctx.calorieTarget * 0.3) / 4) : null;
    return [
      `Your current calorie target is ${fmt(ctx.calorieTarget)} kcal/day.`,
      macro
        ? `A protein intake in the range of ${macro}g/day generally supports muscle retention and recovery for most goals — check your diet plan's macro target for your specific number.`
        : "Complete your fitness profile so I can reference your specific macro target.",
      DISCLAIMER,
    ].join("\n\n");
  }

  if (q.includes("skip cardio")) {
    return [
      `Your goal is currently set to ${ctx.goal}.`,
      ctx.goal === "Weight Loss" || ctx.goal === "Improve Endurance"
        ? "Cardio plays a meaningful role in your calorie deficit and cardiovascular capacity for this goal — I'd recommend keeping it rather than skipping it regularly."
        : "For your current goal, occasional cardio is optional and can be adjusted based on recovery and preference.",
      DISCLAIMER,
    ].join("\n\n");
  }

  if (q.includes("tired") || q.includes("fatigue")) {
    const flags = ctx.fatigueFlags;
    return [
      flags >= 3
        ? `You've logged elevated fatigue ${flags} times in the last 7 days, which is a strong signal to prioritize recovery.`
        : `You've logged elevated fatigue ${flags} time(s) in the last 7 days — not yet at a level that requires a forced recovery day.`,
      "Consider prioritizing sleep, hydration, and slightly reducing training intensity for a few days.",
      DISCLAIMER,
    ].join("\n\n");
  }

  // Default: general status summary
  return [
    `Habit score: ${fmt(ctx.habitScore)}/100. Workout adherence: ${fmt(ctx.workoutAdherence)}%. Diet adherence: ${fmt(
      ctx.dietAdherence
    )}%.`,
    ctx.weightTrendKgPerWeek !== null
      ? `Your weight trend is approximately ${ctx.weightTrendKgPerWeek} kg/week.`
      : "Log your weight consistently for a clearer trend.",
    DISCLAIMER,
  ].join("\n\n");
};
